import z from "zod";
import { ErrorMessages } from "../../factory/error/errorMessages";

export const updateSchemaToken = z.object({
  tokens: z.number().gt(0,ErrorMessages.INVALID_TOKEN_AMOUNT)
}).strict();
