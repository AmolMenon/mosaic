# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json ./
RUN npm install -g pnpm && pnpm install

COPY . .
# We specify the Next.js telemetry disable
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build --workspace=apps/web

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
# Next.js standalone output (requires output: 'standalone' in next.config.js)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3001

CMD ["node", "apps/web/server.js"]
