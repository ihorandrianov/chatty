import fp from "fastify-plugin";
import fastifyPrisma from "@joggr/fastify-prisma";
import { PrismaClient } from "@prisma/client";

export default fp(
  async (fastify, opts) => {
    fastify.register(fastifyPrisma, { client: new PrismaClient() });
  },
  {
    name: "prisma",
  },
);
