# System Overview

## Architecture
- Clean Architecture with DDD: [src/domain](src/domain) (entities + repositories), [src/application](src/application) (use cases + DTOs + ports), [src/infrastructure](src/infrastructure) (HTTP, Prisma, Redis, queues, gateways).
- HTTP routes only parse DTOs and call use cases. Errors bubble to the global handler.

## Folder Map (Clickable)
- [src/domain](src/domain)
- [src/application](src/application)
- [src/infrastructure](src/infrastructure)
- [src/infrastructure/http](src/infrastructure/http)
- [src/infrastructure/repositories](src/infrastructure/repositories)
- [src/infrastructure/gateways](src/infrastructure/gateways)
- [src/infrastructure/queue](src/infrastructure/queue)
- [src/infrastructure/cache](src/infrastructure/cache)
- [src/infrastructure/database](src/infrastructure/database)
- [src/infrastructure/logging](src/infrastructure/logging)
- [prisma](prisma)
- [docker](docker)

## External Services
- **PostgreSQL**: main database (Prisma).
	- Prisma client: [src/infrastructure/database/prisma.client.ts](src/infrastructure/database/prisma.client.ts)
	- Schema + migrations: [prisma/schema.prisma](prisma/schema.prisma), [prisma/migrations](prisma/migrations)
- **Redis**: cache, sessions, login attempts, queues.
	- Redis client: [src/infrastructure/cache/redis.client.ts](src/infrastructure/cache/redis.client.ts)
	- Cache adapter: [src/infrastructure/cache/cache.service.ts](src/infrastructure/cache/cache.service.ts)
	- Sessions: [src/infrastructure/auth/session.service.ts](src/infrastructure/auth/session.service.ts)
	- Login attempts: [src/infrastructure/auth/login-attempts.service.ts](src/infrastructure/auth/login-attempts.service.ts)
	- Queue connection: [src/infrastructure/queue/queue.connection.ts](src/infrastructure/queue/queue.connection.ts)
- **Asaas**: payment gateway (charges + webhooks).
	- Gateway adapter: [src/infrastructure/gateways/asaas.gateway.ts](src/infrastructure/gateways/asaas.gateway.ts)
	- Webhook route: [src/infrastructure/http/routes/webhook.routes.ts](src/infrastructure/http/routes/webhook.routes.ts)
	- Webhook queue: [src/infrastructure/queue/payment-webhook.queue.ts](src/infrastructure/queue/payment-webhook.queue.ts)
- **ELK**: observability (Logstash HTTP input -> Elasticsearch -> Kibana).
	- Logger adapter: [src/infrastructure/logging/logger.ts](src/infrastructure/logging/logger.ts)
	- Logstash pipeline: [docker/logstash/logstash.conf](docker/logstash/logstash.conf)
	- Stack services: [docker-compose.yml](docker-compose.yml)

## Use Cases
- Located in [src/application](src/application).
- Implement business rules and return DTO outputs (no framework types).
- Throw `AppError` for controlled failures.

## Repositories
- Interfaces in [src/domain](src/domain).
- Prisma implementations in [src/infrastructure/repositories](src/infrastructure/repositories).

## Queue Events
- `QueueProcessedEvent` and `QueueFailedJob` store queue job outcomes.
- Worker logs results and records events in the database.

## Important Folders
- [src/domain](src/domain): entities + repository contracts.
- [src/application](src/application): use cases, DTOs, ports, shared errors.
- [src/infrastructure](src/infrastructure): adapters (HTTP, Prisma, Redis, queues, gateways, logging).
- [prisma](prisma): schema + migrations.

## Environment Variables
Required:
- `NODE_ENV`, `PORT`
- `DATABASE_URL`, `DIRECT_URL`
- `REDIS_URL`
- `JWT_SECRET`, `ACCESS_TOKEN_EXPIRES_IN`, `JWT_EXPIRES_IN`
- `SESSION_TTL_SECONDS`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SECONDS`
- `LOGIN_MAX_ATTEMPTS`, `LOGIN_LOCK_SECONDS`
- `ASAAS_API_URL`, `ASAAS_API_KEY`, `ASAAS_WEBHOOK_TOKEN`

Optional:
- `CORS_ORIGINS`
- `LOGSTASH_URL`

## How to Run (Local)
1. `docker compose up --build -d`
2. `npm i`
3. `npx prisma generate`
4. `npm run start:dev`
5. (Optional) `npm run start:worker`

## How it Communicates
- Payments: `PaymentService` -> `AsaasGateway` (HTTP to Asaas API).
- Webhooks: `/webhooks/asaas` validates token -> enqueues job -> worker updates payment.
	- Eventos do Asaas mapeados para status interno (Paid/Refunded/Failed/Pending).
- Sessions/lockout: Redis.
- Logs: stdout JSON + optional Logstash HTTP.

## Conventions
- No try/catch in routes.
- Input/Output validated by DTO schemas.
- Use cases return DTOs, not entities.
