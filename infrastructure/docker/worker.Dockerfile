# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json ./
RUN npm install -g pnpm && pnpm install

COPY . .
# Assuming worker is part of the API workspace or a separate worker workspace
RUN pnpm run build --workspace=apps/api

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

# Workers do not expose ports, they just pull from queues or database
CMD ["node", "apps/api/dist/worker.js"]
