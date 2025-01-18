import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Login can only contain letters, numbers, underscore and dash",
    )
    .min(3, "Login should be at least 3 characters long")
    .max(24, "Login should be no longer then 24 characters")
    .describe(
      "Must be from 3 to 24 chars. allowed chars [a-z] [A-Z] [0-9] [_] [-]",
    )
    .default("--S_T_A_L_K_E_R_114--"),
  password: z
    .string()
    .trim()
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .min(8, "Password should be at least 8 character long")
    .max(24, "Password should not be longer then 25 characters")
    .describe(
      "Must be from 8 to 24 chars. Must contain at least one upper, lower register characters and a number",
    )
    .default("B4StYsCrUg5"),
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
