FROM node:22-alpine AS builder
WORKDIR /var/apps/chat

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build:ts


FROM node:22-alpine AS runner
WORKDIR /var/apps/chat

RUN npm install fastify-cli --global

COPY .env .
ARG DEFAULT_STATIC_FOLDER
RUN mkdir -p $DEFAULT_STATIC_FOLDER

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN chmod 755 /var/apps/chat/ && \
    chmod 755 /var/apps/chat/$DEFAULT_STATIC_FOLDER


RUN chown -R nodejs:nodejs /var/apps/chat/$DEFAULT_STATIC_FOLDER


COPY --from=builder --chown=nodejs:nodejs /var/apps/chat/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /var/apps/chat/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /var/apps/chat/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /var/apps/chat/prisma ./prisma


USER nodejs

EXPOSE 3000

CMD ["fastify", "start", "-l", "info", "dist/app.js"]
