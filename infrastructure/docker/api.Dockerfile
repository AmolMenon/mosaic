# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
# Install dependencies needed for node-gyp if required
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
# Note: In a monorepo, we'd copy root lockfile and workspace config
RUN npm ci

COPY . .
RUN npm run build --workspace=apps/api

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist

USER nodejs
EXPOSE 3000
# Ensure we have a healthcheck for the container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health/liveness || exit 1

CMD ["node", "apps/api/dist/main.js"]
