# Base Stage for shared system dependencies
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Stage 1: Dependency Builder
FROM base AS deps
RUN apk add --no-cache python3 make g++ build-base
WORKDIR /app

# Copy lockfiles and install dependencies
COPY package.json package-lock.json ./

# Strengthen network resilience for npm
RUN --mount=type=cache,target=/root/.npm \
    npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --legacy-peer-deps

# Stage 2: Application Builder
FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client and Build
ENV PRISMA_ENGINES_MIRROR=https://npmmirror.com/mirrors/prisma
RUN npx prisma generate
RUN NEXTAUTH_SECRET=dummy_key \
    NEXTAUTH_URL=http://localhost:3000 \
    DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    REDIS_URL=redis://localhost:6379 \
    STRIPE_SECRET_KEY=dummy_sk \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=dummy_pk \
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY \
    npm run build

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

CMD npx prisma db push --accept-data-loss && npx prisma db seed && npm start
