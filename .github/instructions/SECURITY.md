# Security Instructions

## Baseline
- Use JWT access tokens with short TTL and session-based refresh.
- Store sessions in Redis with a fixed TTL.
- Protect auth endpoints with rate limiting and lockout.
- Validate all request bodies with Zod.
- Verify payment webhooks with provider token.
- Enable CORS and security headers.
- Restrict product write operations to admin/vendedor roles.

## Required Env Vars
- NODE_ENV (local|hml|prod)
- DATABASE_URL
- REDIS_URL
- JWT_SECRET
- ACCESS_TOKEN_EXPIRES_IN
- JWT_EXPIRES_IN
- SESSION_TTL_SECONDS
- RATE_LIMIT_MAX
- RATE_LIMIT_WINDOW_SECONDS
- LOGIN_MAX_ATTEMPTS
- LOGIN_LOCK_SECONDS
- ASAAS_API_URL
- ASAAS_API_KEY
- ASAAS_WEBHOOK_TOKEN
- CORS_ORIGINS (comma separated; optional in local)

## Auth Flow
- POST /register creates a Customer with a hashed password.
- POST /login issues access token + sessionId.
- POST /refresh rotates sessionId and issues a new access token.
- POST /logout revokes the sessionId.

## Webhooks
- Validate header `asaas-access-token` against `ASAAS_WEBHOOK_TOKEN`.
- Always enqueue and process asynchronously.
- Payload pode conter campos novos; manter parsing tolerante para evitar falhas na fila.

## Rate Limiting
- /login, /register, /refresh use RATE_LIMIT_MAX and RATE_LIMIT_WINDOW_SECONDS.
- Lockout after LOGIN_MAX_ATTEMPTS for LOGIN_LOCK_SECONDS.

## CORS
- In local, allow all origins if CORS_ORIGINS is not set.
- In prod, set CORS_ORIGINS explicitly.
