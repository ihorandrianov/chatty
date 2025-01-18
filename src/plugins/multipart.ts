import fp from "fastify-plugin";
import { fastifyMultipart } from "@fastify/multipart";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default fp(
  async (fastify) => {
    fastify.register(fastifyMultipart, {
      limits: {
        fields: 0, // Max number of non-file fields
        fileSize: MAX_FILE_SIZE, // For multipart forms, the max file size in bytes
        files: 1, // Max number of file fields
        headerPairs: 2000, // Max number of header key=>value pairs
        parts: 1000,
      },
    });
  },
  {
    name: "multipart",
  },
);
