import fp from "fastify-plugin";
import { fastifyMultipart } from "@fastify/multipart";

// const ALLOWED_MIME_TYPES = [
//   "image/jpeg",
//   "image/png",
//   "image/gif",
//   "application/pdf",
// ] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default fp(
  async (fastify) => {
    fastify.register(fastifyMultipart, {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100, // Max field value size in bytes
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
