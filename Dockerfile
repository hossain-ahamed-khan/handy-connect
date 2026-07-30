# syntax=docker/dockerfile:1

# ---- Dependencies ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Use webpack build for reproducible CI/container builds (not turbopack)
RUN npx next build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache wget \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
