import { CreateMessage, Message, messageSchema } from "../schemas/message";
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
    const newMessage = await this.prisma.messages.create({
      data: {
        contentType: message.contentType,
        content: message.content,
        mimetype: message.contentType === "FILE" ? message.mimetype : undefined,
        user: {
          connect: {
            id: message.userId,
          },
        },
      },
      omit: {
        userId: true,
      },
      include: {
        user: {
          select: {
            login: true,
          },
        },
      },
    });

    return messageSchema.parse(newMessage);
  }

  async getMessageById(id: number): Promise<Message | null> {
    const message = await this.prisma.messages.findUnique({
      where: {
        id,
      },
      omit: {
        userId: true,
      },
      include: {
        user: {
          select: {
            login: true,
          },
        },
      },
    });
    return message ? messageSchema.parse(message) : null;
  }

  async listMessages({ cursor, limit }: ListMessagesArgs): Promise<Message[]> {
    const messages = await this.prisma.messages.findMany({
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
      omit: {
        userId: true,
      },
      include: {
        user: {
          select: {
            login: true,
          },
        },
      },
    });

    return messages.map((message) => messageSchema.parse(message));
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
