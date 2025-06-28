import z from "zod";
import { ErrorMessages } from "../../factory/error/errorMessages";


export const loginSchema = z.object({
  email: z.string().email({ message: ErrorMessages.INVALID_EMAIL_FORMAT}),
  password: z.string(),
}).strict();