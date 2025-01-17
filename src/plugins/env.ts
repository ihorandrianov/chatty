import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export default fp(async (fastify, opts) => {
  fastify.withTypeProvider<ZodTypeProvider>().register(fastifyEnv, {
    dotenv: true,
    schema: z.object({
      ARGON_SECRET: z.string().min(64),
      DATABASE_URL: z.string().url(),
    }),
  });
});
