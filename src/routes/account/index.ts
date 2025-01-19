import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginSchema, userSchema } from "../../schemas/user";

import { errorResponseSchema } from "../../error/error";

const account: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { userService } = fastify;
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        tags: ["account"],
        body: loginSchema,
        response: {
          201: userSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async function (request, reply) {
      const loginPayload = request.body;
      const user = await userService.createUser(loginPayload);
      reply.status(201);
      return user;
    },
  );
};

export default account;
