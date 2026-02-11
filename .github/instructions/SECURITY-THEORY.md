# Security Theory

## Threat Model (High Level)
- Credential stuffing and brute force on auth endpoints.
- Token replay or stolen tokens in client storage.
- Forged payment webhooks.
- Mass data access without rate limiting.

## Controls
- Short-lived access tokens reduce replay window.
- Redis sessions enable immediate revocation.
- Rate limiting and lockout mitigate brute force.
- Webhook token validation prevents forged callbacks.
- Zod validation prevents malformed input and type confusion.
- Helmet sets secure HTTP headers to reduce common attacks.

## Design Notes
- Sessions are opaque IDs stored server-side, not JWT refresh tokens.
- Rotation on refresh invalidates the previous sessionId.
- In prod, CORS must be restricted to known origins.
