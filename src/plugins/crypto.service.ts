import fp from "fastify-plugin";
import * as argon2 from "argon2";
import { LoginPayload, loginSchema } from "../schemas/user";

export interface UserServiceOptions {
  argon: typeof argon2;
}

const DUMMY_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$6u5nW1oayxaSUrPxQqNEPA$3M+vHxQpfNwHtPE5J2eqrFJQtxY0hPH8bl/w43or1YU";

interface CryptoService {
  hashPassword: (password: string) => Promise<string>;
  verifyPassword: (
    hash: string | undefined,
    password: string,
  ) => Promise<boolean>;
  parseAuth: (authHeader: string) => LoginPayload;
}

export default fp<UserServiceOptions>(
  async (fastify, opts) => {
    const ARGON_SECRET = fastify.config.ARGON_SECRET;
    const secretBuffer = Buffer.from(ARGON_SECRET);
    const argon = opts.argon;

    const cryptoService: CryptoService = {
      hashPassword: async (password) => {
        return await argon.hash(password, {
          secret: secretBuffer,
        });
      },
      verifyPassword: async (hash, password) => {
        if (!hash) {
          await argon.verify(DUMMY_HASH, password, {
            secret: secretBuffer,
          });
          return false;
        }
        return await argon.verify(hash, password, {
          secret: secretBuffer,
        });
      },
      parseAuth: (authHeader) => {
        const [scheme, encodedCredentials] = authHeader.split(" ");

        if (scheme !== "Basic" || !encodedCredentials) {
          throw new Error("Invalid authorization header format");
        }

        const credentials = Buffer.from(
          encodedCredentials,
          "base64",
        ).toString();
        const [login, password] = credentials.split(":");

        return loginSchema.parse({ login, password });
      },
    };

    fastify.decorate("cryptoService", cryptoService);
  },
  {
    name: "crypto-service",
    dependencies: ["env"],
  },
);

export const autoConfig = {
  argon: argon2,
};

declare module "fastify" {
  export interface FastifyInstance {
    cryptoService: CryptoService;
  }
}
