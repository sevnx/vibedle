import { ConvexError, v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

import { modelIdValidator } from "./models";

const MAX_GUESSES = 3;
const TOTAL_ROUNDS = 5;

const guessRecordValidator = v.object({
  model: modelIdValidator,
  usedSkill: v.boolean(),
  result: v.union(v.literal("correct"), v.literal("wrong")),
});

const roundPayloadValidator = v.object({
  roundIndex: v.number(),
  totalRounds: v.number(),
  websiteUrl: v.string(),
  guessesUsed: v.number(),
});

const recapPayloadValidator = v.object({
  gameId: v.id("gameSessions"),
  rounds: v.array(
    v.object({
      model: modelIdValidator,
      usedSkill: v.boolean(),
    }),
  ),
  results: v.array(
    v.object({
      solved: v.boolean(),
      guessesUsed: v.number(),
    }),
  ),
  score: v.number(),
});

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Not authenticated");
  }
  return identity;
}

async function getOwnedSessionOrThrow(
  ctx: QueryCtx | MutationCtx,
  gameId: Id<"gameSessions">,
) {
  const identity = await requireIdentity(ctx);
  const session = await ctx.db.get(gameId);

  if (!session) {
    throw new ConvexError("Game session not found");
  }

  if (session.userTokenIdentifier !== identity.tokenIdentifier) {
    throw new ConvexError("Unauthorized");
  }

  return session;
}

function shuffleInPlace<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = items[i];
    items[i] = items[j]!;
    items[j] = temp!;
  }
}

export const createSession = mutation({
  args: {},
  returns: v.object({
    gameId: v.id("gameSessions"),
    round: roundPayloadValidator,
  }),
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const activeWebsites = await ctx.db
      .query("websites")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(128);

    if (activeWebsites.length < TOTAL_ROUNDS) {
      throw new ConvexError("Not enough active websites to start a game");
    }

    const picked = [...activeWebsites];
    shuffleInPlace(picked);
    const selectedRounds = picked.slice(0, TOTAL_ROUNDS);

    const gameSessionId = await ctx.db.insert("gameSessions", {
      userTokenIdentifier: identity.tokenIdentifier,
      status: "active",
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      createdAt: Date.now(),
    });

    for (let roundIndex = 0; roundIndex < selectedRounds.length; roundIndex += 1) {
      const website = selectedRounds[roundIndex]!;
      await ctx.db.insert("gameRounds", {
        gameSessionId,
        roundIndex,
        websiteId: website._id,
        websiteUrl: website.url,
        expectedModelId: website.modelId,
        expectedUsedSkill: website.usedSkill,
        guessesUsed: 0,
        status: "playing",
        solved: false,
      });
    }

    const firstRound = selectedRounds[0]!;

    return {
      gameId: gameSessionId,
      round: {
        roundIndex: 0,
        totalRounds: TOTAL_ROUNDS,
        websiteUrl: firstRound.url,
        guessesUsed: 0,
      },
    };
  },
});

export const getRound = query({
  args: {
    gameId: v.id("gameSessions"),
    roundIndex: v.number(),
  },
  returns: roundPayloadValidator,
  handler: async (ctx, args) => {
    const session = await getOwnedSessionOrThrow(ctx, args.gameId);

    const round = await ctx.db
      .query("gameRounds")
      .withIndex("by_gameSessionId_and_roundIndex", (q) =>
        q.eq("gameSessionId", session._id).eq("roundIndex", args.roundIndex),
      )
      .unique();

    if (!round) {
      throw new ConvexError("Round not found");
    }

    return {
      roundIndex: round.roundIndex,
      totalRounds: session.totalRounds,
      websiteUrl: round.websiteUrl,
      guessesUsed: round.guessesUsed,
    };
  },
});

export const submitGuess = mutation({
  args: {
    gameId: v.id("gameSessions"),
    roundIndex: v.number(),
    model: modelIdValidator,
    usedSkill: v.boolean(),
  },
  returns: v.object({
    record: guessRecordValidator,
    solved: v.boolean(),
    exhausted: v.boolean(),
    guessesUsed: v.number(),
    correctModel: v.union(modelIdValidator, v.null()),
    correctUsedSkill: v.union(v.boolean(), v.null()),
    nextRound: v.union(roundPayloadValidator, v.null()),
    recap: v.union(recapPayloadValidator, v.null()),
  }),
  handler: async (ctx, args) => {
    const session = await getOwnedSessionOrThrow(ctx, args.gameId);

    if (session.status !== "active") {
      throw new ConvexError("Game already completed");
    }

    const round = await ctx.db
      .query("gameRounds")
      .withIndex("by_gameSessionId_and_roundIndex", (q) =>
        q.eq("gameSessionId", session._id).eq("roundIndex", args.roundIndex),
      )
      .unique();

    if (!round) {
      throw new ConvexError("Round not found");
    }

    if (round.status !== "playing") {
      throw new ConvexError("Round already resolved");
    }

    const solved = args.model === round.expectedModelId && args.usedSkill === round.expectedUsedSkill;
    const guessesUsed = round.guessesUsed + 1;
    const exhausted = !solved && guessesUsed >= MAX_GUESSES;

    await ctx.db.patch(round._id, {
      guessesUsed,
      solved,
      status: solved ? "solved" : exhausted ? "failed" : "playing",
    });

    const record = {
      model: args.model,
      usedSkill: args.usedSkill,
      result: solved ? "correct" : "wrong",
    } as const;

    if (!solved && !exhausted) {
      return {
        record,
        solved,
        exhausted,
        guessesUsed,
        correctModel: null,
        correctUsedSkill: null,
        nextRound: null,
        recap: null,
      };
    }

    const updatedScore = solved ? session.score + 1 : session.score;
    const isFinalRound = round.roundIndex + 1 >= session.totalRounds;

    if (isFinalRound) {
      await ctx.db.patch(session._id, {
        status: "completed",
        score: updatedScore,
        completedAt: Date.now(),
      });

      const allRounds = await ctx.db
        .query("gameRounds")
        .withIndex("by_gameSessionId_and_roundIndex", (q) => q.eq("gameSessionId", session._id))
        .take(session.totalRounds);

      return {
        record,
        solved,
        exhausted,
        guessesUsed,
        correctModel: solved ? null : round.expectedModelId,
        correctUsedSkill: solved ? null : round.expectedUsedSkill,
        nextRound: null,
        recap: {
          gameId: session._id,
          rounds: allRounds.map((item) => ({
            model: item.expectedModelId,
            usedSkill: item.expectedUsedSkill,
          })),
          results: allRounds.map((item) => ({
            solved: item.solved,
            guessesUsed: item.guessesUsed,
          })),
          score: updatedScore,
        },
      };
    }

    if (solved) {
      await ctx.db.patch(session._id, {
        score: updatedScore,
      });
    }

    const nextRound = await ctx.db
      .query("gameRounds")
      .withIndex("by_gameSessionId_and_roundIndex", (q) =>
        q.eq("gameSessionId", session._id).eq("roundIndex", round.roundIndex + 1),
      )
      .unique();

    if (!nextRound) {
      throw new ConvexError("Next round not found");
    }

    return {
      record,
      solved,
      exhausted,
      guessesUsed,
      correctModel: solved ? null : round.expectedModelId,
      correctUsedSkill: solved ? null : round.expectedUsedSkill,
      nextRound: {
        roundIndex: nextRound.roundIndex,
        totalRounds: session.totalRounds,
        websiteUrl: nextRound.websiteUrl,
        guessesUsed: nextRound.guessesUsed,
      },
      recap: null,
    };
  },
});

export const getRecap = query({
  args: {
    gameId: v.id("gameSessions"),
  },
  returns: recapPayloadValidator,
  handler: async (ctx, args) => {
    const session = await getOwnedSessionOrThrow(ctx, args.gameId);

    const rounds = await ctx.db
      .query("gameRounds")
      .withIndex("by_gameSessionId_and_roundIndex", (q) => q.eq("gameSessionId", session._id))
      .take(session.totalRounds);

    return {
      gameId: session._id,
      rounds: rounds.map((round) => ({
        model: round.expectedModelId,
        usedSkill: round.expectedUsedSkill,
      })),
      results: rounds.map((round) => ({
        solved: round.solved,
        guessesUsed: round.guessesUsed,
      })),
      score: session.score,
    };
  },
});
