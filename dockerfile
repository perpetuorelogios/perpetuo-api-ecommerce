# ========================
# BUILD STAGE
# ========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# ========================
# RUNTIME STAGE
# ========================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# 🔥 dependências nativas obrigatórias do Prisma
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev

# código
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# 🔥 agora sim: prisma generate no runtime real
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "dist/main.cjs"]
