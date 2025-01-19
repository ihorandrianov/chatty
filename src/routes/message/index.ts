import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { textMessageSchema } from "../../schemas/message";
import { NetError } from "../../error/error";
import z from "zod";
import { MultipartFile } from "@fastify/multipart";
import { ALLOWED_MIME_TYPES } from "../../plugins/file.service";

const account: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { messageService } = fastify;
  fastify.addHook("preHandler", fastify.basicAuth);
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/text",
      {
        schema: {
          body: textMessageSchema,
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      async (req, res) => {
        const { user, body } = req;
        const message = await messageService.handleIncTextMessage(
          body,
          user.id,
        );
        return message;
      },
    )
    .post(
      "/file",
      {
        schema: {
          consumes: ["multipart/form-data"],
          body: z.custom<MultipartFile>(),
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      async (req, res) => {
        const file = await req.file();
        const { user } = req;
        if (file) {
          try {
            const savedFile = await messageService.handleIncFileMessage(
              file,
              user.id,
            );
            return savedFile;
          } catch (e) {
            throw new NetError(400, (e as Error).message);
          }
        } else {
          throw new NetError(400, "No file found");
        }
      },
    )
    .get(
      "/",
      {
        schema: {
          querystring: z.object({
            limit: z
              .string()
              .refine(
                (limit) =>
                  !isNaN(Number(limit)) &&
                  Number(limit) > 0 &&
                  Number(limit) === Math.floor(Number(limit)),
                "id Must be number > 0 and Must be round",
              )

              .transform((id) => Number(id))
              .describe("Limit"),
            cursor: z
              .string()
              .optional()
              .refine((id) => {
                if (typeof id === "string") {
                  return (
                    !isNaN(Number(id)) &&
                    Number(id) > 0 &&
                    Number(id) === Math.floor(Number(id))
                  );
                }
                return true;
              }, "cursor Must be number > 0 and Must be round")

              .transform((id) => (typeof id === "string" ? Number(id) : id))
              .describe("Cursor must be message id or absent"),
          }),
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      async (req, res) => {
        const { limit, cursor } = req.query;
        const messages = await messageService.retrieveMessages({
          limit,
          cursor,
        });

        return messages;
      },
    )
    .get(
      "/:id",
      {
        schema: {
          produces: ALLOWED_MIME_TYPES,
          params: z.object({
            id: z
              .string()
              .refine(
                (id) =>
                  !isNaN(Number(id)) &&
                  Number(id) > 0 &&
                  Number(id) === Math.floor(Number(id)),
                "id Must be number > 0 and Must be round",
              )

              .transform((id) => Number(id))
              .describe("Message id"),
          }),
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      async (req, res) => {
        const { id } = req.params;
        const message = await messageService.retrieveMessageContent(id);

        if (!message) {
          throw new NetError(404, "No message found!");
        }

        switch (message.contentType) {
          case "TEXT":
            return message.content;
          case "FILE":
            return res.redirect(message.content);
        }
      },
    );
};

export default account;
