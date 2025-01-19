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

    transform: (data) => {
      const jsonSchema = jsonSchemaTransform(data);

      normalizeFileFields(jsonSchema.schema);

      return jsonSchema;
    },
  });
  fastify.register(fastifySwaggerUI, {});
});

const normalizeFileFields = (obj: Record<string, any>) => {
  let routeContainsFile = false;

  if (
    obj.hasOwnProperty("consumes") &&
    obj.consumes.includes("multipart/form-data")
  ) {
    routeContainsFile = true;
  }

  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (key === "body" && routeContainsFile) {
        obj[key] = {
          type: "object",
          required: ["file"],
          properties: {
            file: { type: "file" },
          },
        };
      } else {
        normalizeFileFields(obj[key]);
      }
    }
  }

  return obj;
};
