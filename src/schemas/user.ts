import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Login can only contain letters, numbers, underscore and dash",
    })
    .min(3)
    .max(24)
    .describe(
      "Must be from 3 to 24 chars. allowed chars [a-z] [A-Z] [0-9] [_] [-]",
    ),
  password: z
    .string()
    .trim()
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .min(8, { message: "Password should be at least 8 character long" })
    .max(24, { message: "Password should not be longer then 25 characters" })
    .describe(
      "Must be from 8 to 24 chars. Must contain at least one upper, lower register characters and a number",
    ),
});
export type LoginPayload = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  login: z.string(),
  id: z.number(),
});

export const userAndPassSchema = userSchema.extend({
  password: z.string(),
});
export type User = z.infer<typeof userSchema>;

export type UserWithPass = z.infer<typeof userAndPassSchema>;
