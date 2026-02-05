# ========================
# BUILD STAGE
# ========================
FROM node:20-alpine AS builder

WORKDIR /app

# deps primeiro (cache eficiente)
COPY package*.json ./
RUN npm ci

# código
COPY . .

# build da aplicação
RUN npm run build


# ========================
# RUNTIME STAGE
# ========================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# dependências nativas exigidas pelo Prisma
RUN apk add --no-cache openssl libc6-compat

# deps de produção
COPY package*.json ./
RUN npm ci --omit=dev

# artefatos buildados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# gera o Prisma Client no runtime real
RUN npx prisma generate

# porta da API
EXPOSE 3000

# migração + start (fail fast)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.cjs"]
