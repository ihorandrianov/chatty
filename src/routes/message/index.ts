import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const account: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post("/text", {}, async (req, res) => {})
    .post("/file", {}, async (req, res) => {})
    .get("/", {}, (req, res) => {})
    .get("/:id", {}, (req, res) => {});
};

export default account;
