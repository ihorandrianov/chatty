import fp from "fastify-plugin";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export default fp(async function (fastify, opts) {
  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Chat API",
        description: "Chat API",
        version: "0.1.0",
      },
      securityDefinitions: {
        Authorization: {
          type: "basic",
        },
      },
    },

    transform: jsonSchemaTransform,
  });
  fastify.register(fastifySwaggerUI, {});
});
