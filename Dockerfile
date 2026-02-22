# Stage 1: Dependencies (avec les dépendances DEV)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci && \
    npm cache clean --force

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Générer les types Prisma AVANT le build
RUN npx prisma generate
RUN npm run build

# Stage 3: Production dependencies only
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force

# Stage 4: Runner
FROM node:22-alpine AS runner
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs
WORKDIR /app

# Copier seulement ce qui est nécessaire
COPY --from=builder /app/dist/src ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Donner les permissions
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000
CMD ["node", "dist/main.js"]