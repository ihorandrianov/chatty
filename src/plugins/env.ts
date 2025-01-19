import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";

const ENV_SCHEMA = {
  type: "object",
  required: [
    "ARGON_SECRET",
    "DATABASE_URL",
    "DEFAULT_STATIC_FOLDER",
    "FILESIZE_LIMIT",
  ],
  properties: {
    DATABASE_URL: {
      type: "string",
    },
    ARGON_SECRET: {
      type: "string",
    },
    DEFAULT_STATIC_FOLDER: {
      type: "string",
    },
    FILESIZE_LIMIT: {
      type: "number",
    },
  },
};

export default fp(
  async (fastify, opts) => {
    fastify.register(fastifyEnv, {
      dotenv: true,
      schema: ENV_SCHEMA,
    });
  },
  {
    name: "env",
  },
);

declare module "fastify" {
  interface FastifyInstance {
    config: {
      DATABASE_URL: string;
      ARGON_SECRET: string;
      DEFAULT_STATIC_FOLDER: string;
      FILESIZE_LIMIT: number;
    };
  }
}
