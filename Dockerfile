# Base Stage for shared system dependencies
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Stage 1: Dependency Builder
FROM base AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app

# Copy lockfiles and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Application Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client and Build
RUN npx prisma generate
RUN npm run build

# Stage 3: Production Runner (Hardened)
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry for maximum privacy
ENV NEXT_TELEMETRY_DISABLED=1

# Create unprivileged coaching user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD npx prisma migrate deploy && npm start
