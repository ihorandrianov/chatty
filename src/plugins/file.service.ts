import { MultipartFile } from "@fastify/multipart";
import fp from "fastify-plugin";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";
import path from "node:path";
import sanitize from "sanitize-filename";
import { SavedFile, savedFileScheme } from "../schemas/file";

export interface FileService {
  saveFile(file: MultipartFile): Promise<SavedFile>;
  generateSafeFileName(filename: string): string;
  getDefaultFolder(): string;
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
];

export class FSFileService implements FileService {
  constructor(private writeFolder: string) {}
  async saveFile(fileRef: MultipartFile) {
    const { mimetype, filename, file } = fileRef;
    if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
      file.destroy(new Error("This mimetype is not allowed"));
      throw new Error("This mimetype is not allowed");
    }
    const sanitizedFilename = this.generateSafeFileName(filename);
    const savePath = path.join(
      __dirname,
      "..",
      "..",
      this.writeFolder,
      sanitizedFilename,
    );
    await pipeline(file, createWriteStream(savePath));
    if (file.truncated) {
      await unlink(savePath);
      throw new Error("File is too big, limit is 5 mb");
    }

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

  getDefaultFolder(): string {
    const defaultFolder = this.writeFolder;
    return defaultFolder;
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
