import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import fp from "fastify-plugin";
import { User } from "../schemas/user";

type Auth = (request: FastifyRequest, reply: FastifyReply) => Promise<void>;

export default fp(
  async (fastify, opts) => {
    const { userService } = fastify;
    fastify.decorateRequest("user");

    fastify.decorate(
      "basicAuth",
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const authHeader = request.headers.authorization;
          if (authHeader) {
            const user = await userService.verifyUser(authHeader);
            if (!user) {
              return reply
                .status(403)
                .header("WWW-Authenticate", "Basic")
                .send();
            }

            request.user = user;
            return;
          }
          return reply.status(403).header("WWW-Authenticate", "Basic").send();
        } catch (e) {
          fastify.log.error(e);
          return reply.status(403).header("WWW-Authenticate", "Basic").send();
        }
      },
    );
  },
  {
    name: "auth-prehandler",
    dependencies: ["user-service"],
  },
);

declare module "fastify" {
  export interface FastifyInstance {
    basicAuth: Auth;
  }
  export interface FastifyRequest {
    user: User;
  }
}
