import {
  userSchema,
  LoginPayload,
  User,
  UserWithPass,
  userAndPassSchema,
} from "../schemas/user";
import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

interface UserRepository {
  getUserById(id: number): Promise<UserWithPass | null>;

  getUserByLogin(login: string): Promise<UserWithPass | null>;

  createUser(user: LoginPayload): Promise<User>;
}

class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getUserById(id: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (user) {
      return userAndPassSchema.parse(user);
    }
    return null;
  }

  async getUserByLogin(login: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        login,
      },
    });

    if (user) {
      return userAndPassSchema.strip().parse(user);
    }
    return null;
  }

  async createUser({ login, password }: LoginPayload) {
    const user = await this.prisma.users.create({
      data: {
        login,
        password,
      },
    });

    return userSchema.strip().parse(user);
  }
}

export default fp(
  async (fastify, opts) => {
    const { prisma } = fastify;
    fastify.decorate("userRepository", new PrismaUserRepository(prisma));
  },
  {
    name: "user-repository",
    dependencies: ["prisma"],
  },
);

declare module "fastify" {
  export interface FastifyInstance {
    userRepository: UserRepository;
  }
}
