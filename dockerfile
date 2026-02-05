# ========================
# 1. BASE STAGE
# ========================
FROM node:20-alpine AS base

WORKDIR /app

# Dependências do sistema (necessárias para o Prisma/Nest)
RUN apk add --no-cache openssl libc6-compat

# ========================
# 2. DEPS STAGE (Instala node_modules)
# ========================
FROM base AS deps
COPY package*.json ./
# Instala tudo (incluindo devDependencies)
RUN npm install

# ========================
# 3. DEV STAGE (Para rodar local)
# ========================
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ⚠️ NÃO rodamos 'prisma generate' aqui no build de dev.
# Deixamos para o docker-compose rodar.

EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ========================
# 4. BUILDER STAGE (Para Produção)
# ========================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ========================
# 5. RUNNER STAGE (Produção Final)
# ========================
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

RUN npm ci --omit=dev
RUN npx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.cjs"]