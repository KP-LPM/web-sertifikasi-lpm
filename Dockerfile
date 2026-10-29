# Base image dengan Node.js 20
FROM node:20-alpine AS base

# Install dependencies yang dibutuhkan oleh Chromium & Font Times New Roman / Liberation
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto \
    msttcorefonts-installer \
    fontconfig \
    openssl \
    && update-ms-fonts \
    && fc-cache -f

# Tentukan path Chromium bawaan sistem untuk Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Build aplikasi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Salin hasil build dan file yang dibutuhkan
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
