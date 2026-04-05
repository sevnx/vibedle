import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const modelIdValidator = v.union(
  v.literal("gpt-5.4"),
  v.literal("claude-4.6-opus"),
  v.literal("gemini-3.1-pro"),
);

const gameSessionStatusValidator = v.union(v.literal("active"), v.literal("completed"));
const gameRoundStatusValidator = v.union(v.literal("playing"), v.literal("solved"), v.literal("failed"));

export default defineSchema({
  websites: defineTable({
    url: v.string(),
    modelId: modelIdValidator,
    usedSkill: v.boolean(),
    isActive: v.boolean(),
  }).index("by_isActive", ["isActive"]),

  gameSessions: defineTable({
    userTokenIdentifier: v.string(),
    status: gameSessionStatusValidator,
    totalRounds: v.number(),
    score: v.number(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_userTokenIdentifier_and_createdAt", ["userTokenIdentifier", "createdAt"]),

  gameRounds: defineTable({
    gameSessionId: v.id("gameSessions"),
    roundIndex: v.number(),
    websiteId: v.id("websites"),
    websiteUrl: v.string(),
    expectedModelId: modelIdValidator,
    expectedUsedSkill: v.boolean(),
    guessesUsed: v.number(),
    status: gameRoundStatusValidator,
    solved: v.boolean(),
  }).index("by_gameSessionId_and_roundIndex", ["gameSessionId", "roundIndex"]),
});
