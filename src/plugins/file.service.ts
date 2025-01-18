import { MultipartFile } from "@fastify/multipart";
import fp from "fastify-plugin";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import sanitize from "sanitize-filename";
import { SavedFile, savedFileScheme } from "../schemas/file";

interface FileService {
  saveFile(file: MultipartFile): Promise<SavedFile>;
  generateSafeFileName(filename: string): string;
}

class FSFileService implements FileService {
  constructor(private writeFolder: string) {}
  async saveFile(fileRef: MultipartFile) {
    const { mimetype, filename, file } = fileRef;
    const sanitizedFilename = this.generateSafeFileName(filename);
    const savePath = path.join(
      __dirname,
      "..",
      "..",
      this.writeFolder,
      sanitizedFilename,
    );
    await pipeline(file, createWriteStream(savePath));

    return savedFileScheme.parse({
      mimetype,
      filename: sanitizedFilename,
    });
  }

  generateSafeFileName(filename: string) {
    const sanitizedFilename = sanitize(filename).replaceAll(" ", "_");
    const now = Math.floor(Date.now() / 1000).toString();
    return `${now}_${sanitizedFilename}`;
  }
}

export default fp(
  async (fastify, opts) => {
    const writeFolder = fastify.config.DEFAULT_STATIC_FOLDER;

    fastify.decorate("fileService", new FSFileService(writeFolder));
  },
  {
    name: "file-service",
    dependencies: ["multipart", "env"],
  },
);

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    fileService: FileService;
  }
}
