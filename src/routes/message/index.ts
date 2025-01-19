import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  messageResponseSchema,
  messsageListResponse,
  textMessageSchema,
} from "../../schemas/message";
import { errorResponseSchema, NetError } from "../../error/error";
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
          response: {
            201: messageResponseSchema,
            400: errorResponseSchema,
          },
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      async (request, reply) => {
        const { user, body } = request;
        const message = await messageService.handleIncTextMessage(
          body,
          user.id,
        );
        reply.status(201);
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
      async (request, reply) => {
        const file = await request.file();
        const { user } = request;
        if (file) {
          try {
            const savedFile = await messageService.handleIncFileMessage(
              file,
              user.id,
            );
            reply.status(201);
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
          response: {
            200: messsageListResponse,
            400: errorResponseSchema,
          },
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      async (request, reply) => {
        const { limit, cursor } = request.query;
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
          response: {
            200: z.string(),
            404: errorResponseSchema,
            400: errorResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params;
        const message = await messageService.retrieveMessageContent(id);

        if (!message) {
          throw new NetError(404, "No message found!");
        }

        switch (message.contentType) {
          case "TEXT":
            return message.content;
          case "FILE":
            return reply.redirect(message.content);
        }
      },
    );
};

export default account;
