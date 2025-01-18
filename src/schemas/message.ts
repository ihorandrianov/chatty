import z from "zod";

export const messageTypeScheme = z.enum(["TEXT", "FILE"]);

export const messageSchema = z.object({
  contentType: messageTypeScheme,
  content: z.string(),
  id: z.number(),
});

export type Message = z.infer<typeof messageSchema>;

export type MessageType = z.infer<typeof messageTypeScheme>;

export const createMessageScheme = z.object({
  contentType: messageTypeScheme,
  content: z.string(),
  userId: z.number(),
});

export type CreateMessage = z.infer<typeof createMessageScheme>;
