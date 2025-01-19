import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import path from "node:path";

export default fp(
  async (fastify, options) => {
    fastify.register(fastifyStatic, {
      root: path.join(
        __dirname,
        `../../${fastify.config.DEFAULT_STATIC_FOLDER}`,
      ),
      prefix: "/uploads/",
      cacheControl: true,
    });
  },
  {
    name: "static",
    dependencies: ["env"],
  },
);
