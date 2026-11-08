import { z } from "zod";

export const UpsertUserGuideSchema = z.object({
  role: z.enum(["asesi", "asesor", "admin"]),
  link_ppt: z.string().min(1, "Link PPT (User Guide) wajib diisi"),
});

export type UpsertUserGuideInput = z.infer<typeof UpsertUserGuideSchema>;

