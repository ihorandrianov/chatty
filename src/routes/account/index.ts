import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginSchema } from "../../schemas/user";
import z from "zod";

const account: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { userService } = fastify;
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        tags: ["account"],
        body: loginSchema,
        response: {
          201: z.string(),
          400: z.object({}),
        },
      },
    },
    async function (request, reply) {
      const loginPayload = request.body;
      const user = await userService.createUser(loginPayload);

      return user;
    },
  );
};

export default account;
