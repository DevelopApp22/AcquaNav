import { isValidObjectId } from "mongoose";
import z from "zod";
import { ErrorMessages } from "../../factory/error/errorMessages";

export const objectIdSchema = z.string().refine(isValidObjectId, {
  message: ErrorMessages.INVALID_OBJECT_ID_FORMAT,
});