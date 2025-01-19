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
      const isValidation = !!error.stack?.includes("validate");
      const response: ErrorResponse = {
        message: error.message,
        code: isValidation ? "VALIDATION ERROR" : "INTERNAL SERVER ERROR",
        details: isValidation
          ? undefined
          : {
              stack: error.stack,
            },
      };

      return reply.status(isValidation ? 400 : 500).send(response);
    });
  },
  {
    name: "error-handler",
  },
);
