import fp from "fastify-plugin";
import { User, userSchema, LoginPayload } from "../schemas/user";

export interface UserServiceOptions {}

interface UserService {
  createUser: (credentials: LoginPayload) => Promise<User>;
  verifyUser: (authHeader: string) => Promise<User | null>;
}
// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<UserServiceOptions>(
  async (fastify, opts) => {
    const { cryptoService, userRepository } = fastify;
    const userService: UserService = {
      createUser: async (credentials) => {
        const { login, password } = credentials;
        const passwordHash = await cryptoService.hashPassword(password);
        const user = await userRepository.createUser({
          login,
          password: passwordHash,
        });

        return user;
      },
      verifyUser: async (authHeader) => {
        const { login, password } = cryptoService.parseAuth(authHeader);
        const user = await userRepository.getUserByLogin(login);
        const verified = await cryptoService.verifyPassword(
          user?.password,
          password,
        );
        if (verified) {
          return userSchema.strip().parse(user);
        }
        return null;
      },
    };
    fastify.decorate("userService", userService);
  },
  {
    name: "user-service",
    dependencies: ["user-repository", "crypto-service"],
  },
);

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {}
}
