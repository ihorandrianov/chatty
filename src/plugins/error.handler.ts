import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ZodError } from "zod";
import { ErrorResponse, NetError } from "../error/error";

export default fp(
  async function errorHandle(fastify: FastifyInstance) {
    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error(error);
      if (error instanceof ZodError) {
        const response: ErrorResponse = {
          message: "Validation error",
          code: "VALIDATION_ERROR",
          details: {
            errors: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
              code: err.code,
            })),
          },
        };
        return reply.status(400).send(response);
      }

      if (error instanceof NetError) {
        const response: ErrorResponse = {
          message: error.message,
          code: `ERROR_${error.statusCode}`,
        };
        return reply.status(error.statusCode).send(response);
      }

      const response: ErrorResponse = {
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
        details: {
          stack: error.stack,
        },
      };

      return reply.status(500).send(response);
    });
  },
  {
    name: "error-handler",
  },
);
