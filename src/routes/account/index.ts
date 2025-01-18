import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginSchema } from "../../schemas/login";
import z from "zod";

const account: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        tags: ["account"],
        body: loginSchema,
        response: {
          201: z.string(),
        },
      },
    },
    async function (request, reply) {},
  );
};

export default account;
