import { z } from "zod";
import { waypointSchema } from "./navigationPlan.schema";


export const restrictedAreaSchema = z.object({
    topLeft: waypointSchema,
    bottomLeft: waypointSchema,
}).strict();