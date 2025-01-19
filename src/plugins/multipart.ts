import fp from "fastify-plugin";
import { fastifyMultipart } from "@fastify/multipart";

export default fp(
  async (fastify) => {
    const MAX_FILE_SIZE = fastify.config.FILESIZE_LIMIT;
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
    dependencies: ["env"],
  },
);
