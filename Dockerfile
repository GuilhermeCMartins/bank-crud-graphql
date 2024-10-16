FROM node:20-slim AS base
RUN corepack enable

FROM base AS prod
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --prod --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base
COPY --from=prod /app/node_modules ./node_modules
COPY --from=prod /app/build ./build
COPY --from=prod /app/package.json .
COPY --from=prod /app/uploads ./uploads
EXPOSE 3333
CMD [ "pnpm", "start"]
