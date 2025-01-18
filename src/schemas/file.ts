import z from "zod";

export const savedFileScheme = z.object({
  mimetype: z.string(),
  filename: z.string(),
});

export type SavedFile = z.infer<typeof savedFileScheme>;
