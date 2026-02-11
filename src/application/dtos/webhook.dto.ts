import { z } from 'zod'

export const WebhookPayloadSchema = z.record(z.unknown())

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>
