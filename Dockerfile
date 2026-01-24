FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat

RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS builder
RUN apk add --no-cache libc6-compat

RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm db:generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=true

RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="http://localhost:8080"
ENV FEIDE_CLIENT_ID="build"
ENV FEIDE_CLIENT_SECRET="build"
ENV SKIP_ENV_VALIDATION=true
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
