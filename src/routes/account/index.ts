import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const account: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get("/", async function (request, reply) {
      return { root: true };
    });
};

export default account;
