# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies needed for node-gyp if required
RUN apk add --no-cache python3 make g++ git

ENV HUSKY=0
RUN corepack enable pnpm
COPY . .
RUN pnpm install --frozen-lockfile

# We specify the Next.js telemetry disable
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
# Next.js standalone output (requires output: 'standalone' in next.config.js)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3001

CMD ["node", "apps/web/server.js"]
