import { z } from "zod";

export const BaseUserSchema = z.object({
  username: z.string().trim().min(1),
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
  role: z.enum([
    "admin",
    "asesor",
    "asesi",
    "direktur",
    "manajer",
    "dewan_pengarah",
    "komite_skema",
  ]),
  isActive: z.boolean(),
});

export type BaseUserInput = z.infer<typeof BaseUserSchema>;
