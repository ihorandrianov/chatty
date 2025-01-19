// import { FastifyInstance } from "fastify";
// import fp from "fastify-plugin";
// import { ZodError } from "zod";

// export default fp(
//   async function errorHandle(fastify: FastifyInstance) {
//     fastify.setErrorHandler((error, request, reply) => {
//       fastify.log.error(error);
//       if (error instanceof ZodError) {
//         reply.status(400).send({
//           message: "Validation error",
//           errors: error.errors.map((err) => {
//             return {
//               field: err.path.join("_"),
//               message: err.message,
//             };
//           }),
//         });
//         return reply;
//       }

//       return reply
//         .status(Number(error.statusCode) | 500)
//         .send({ message: error.message });
//     });
//   },
//   {
//     name: "error-handler",
//   },
// );
