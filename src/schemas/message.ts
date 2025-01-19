import z from "zod";

export const messageTypeScheme = z.enum(["TEXT", "FILE"]);

export const messageSchema = z.object({
  contentType: messageTypeScheme,
  content: z.string(),
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z
    .object({
      login: z.string(),
    })
    .transform((user) => user.login),
});

export const messageResponseSchema = z.object({
  contentType: messageTypeScheme,
  content: z.string(),
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.string(),
});
export const messsageListResponse = z.array(messageResponseSchema);

export const textMessageSchema = z.object({
  content: z.string().trim().min(1),
});

export type MessageBody = z.infer<typeof textMessageSchema>;

export type Message = z.infer<typeof messageSchema>;

export type MessageType = z.infer<typeof messageTypeScheme>;

export const createMessageScheme = z.discriminatedUnion("contentType", [
  z.object({
    contentType: z.literal("TEXT"),
    content: z.string(),
    userId: z.number(),
  }),
  z.object({
    contentType: z.literal("FILE"),
    content: z.string(),
    userId: z.number(),
    mimetype: z.string(),
  }),
]);

export type CreateMessage = z.infer<typeof createMessageScheme>;
