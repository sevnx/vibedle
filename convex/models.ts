import { v } from "convex/values";

import { MODEL_CATALOG } from "../lib/game/modelCatalog";

export const modelIdValidator = v.union(...MODEL_CATALOG.map((m) => v.literal(m.label)));
