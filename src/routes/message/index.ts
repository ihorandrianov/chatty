import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const account: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook("preHandler", fastify.basicAuth);
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/text",
      {
        schema: {
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      async (req, res) => {},
    )
    .post(
      "/file",
      {
        schema: {
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      async (req, res) => {
        req.file();
      },
    )
    .get(
      "/",
      {
        schema: {
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      (req, res) => {
        return {
          hello: "world",
        };
      },
    )
    .get(
      "/:id",
      {
        schema: {
          security: [
            {
              Authorization: [],
            },
          ],
        },
      },
      (req, res) => {},
    );
};

export default account;
