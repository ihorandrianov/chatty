import { CreateMessage, Message } from "../schemas/message";
import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

export type ListMessagesArgs = {
  cursor?: number;
  limit: number;
};

export interface MessageRepository {
  createMessage(createMessageArgs: CreateMessage): Promise<Message>;

  getMessageById(id: number): Promise<Message | null>;

  listMessages(listMessagesArgs: ListMessagesArgs): Promise<Message[]>;
}

export class PrismaMessageRepository implements MessageRepository {
  constructor(private prisma: PrismaClient) {}

  async createMessage(message: CreateMessage): Promise<Message> {
    return this.prisma.messages.create({
      data: {
        contentType: message.contentType,
        content: message.content,
        mimetype: message.contentType === "FILE" ? message.mimetype : undefined,
        Users: {
          connect: {
            id: message.userId,
          },
        },
      },
    });
  }

  async getMessageById(id: number): Promise<Message | null> {
    return this.prisma.messages.findUnique({
      where: {
        id,
      },
    });
  }

  async listMessages({ cursor, limit }: ListMessagesArgs): Promise<Message[]> {
    return this.prisma.messages.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default fp(
  async (fastify, opts) => {
    const { prisma } = fastify;
    fastify.decorate("messageRepository", new PrismaMessageRepository(prisma));
  },
  {
    name: "message-repository",
    dependencies: ["prisma"],
  },
);

declare module "fastify" {
  export interface FastifyInstance {
    messageRepository: MessageRepository;
  }
}
