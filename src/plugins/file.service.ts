import fp from "fastify-plugin";

export interface FileServiceOptions {}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<FileServiceOptions>(async (fastify, opts) => {}, {
  name: "file-service",
  dependencies: ["prisma", "multipart"],
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {}
}
