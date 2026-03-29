# Base Stage for shared system dependencies
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl ca-certificates curl

# Stage 1: Dependency Builder
FROM base AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app

# Copy lockfiles and install dependencies
COPY package.json ./
# If you have a lockfile, uncomment the next line
# COPY package-lock.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Application Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client and Build
RUN npx prisma generate
RUN STRIPE_SECRET_KEY=dummy_key STRIPE_WEBHOOK_SECRET=dummy_key NEXTAUTH_SECRET=dummy_key NEXTAUTH_URL=http://localhost:3000 DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" REDIS_URL=redis://localhost:6379 npm run build

# Stage 3: Production Runner (Hardened)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry for maximum privacy
ENV NEXT_TELEMETRY_DISABLED=1

# Create unprivileged coaching user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD npx prisma db push && npm start
