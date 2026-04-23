FROM node:20-alpine AS base
WORKDIR /app

# Install system deps for building native modules
RUN apk add --no-cache python3 make g++ bash libc6-compat

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY .yarn/releases .yarn/releases

# Copy only dependency manifests first for better rebuilds
COPY package.json .

# Install Yarn 4 using the project's yarnPath and install dependencies
RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn install --immutable --immutable-cache || true

# Copy rest of sources
COPY tsconfig.json tsconfig.build.json prisma prisma.config.ts ./
COPY src ./src
COPY prisma ./prisma
COPY .env ./

# Generate Prisma client and build
RUN yarn prisma generate || true
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache bash libc6-compat

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.env ./.env

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
