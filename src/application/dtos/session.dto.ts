import { z } from 'zod'

export const SessionRefreshRequestSchema = z.object({
  sessionId: z.string().min(1),
})

export type SessionRefreshRequest = z.infer<
  typeof SessionRefreshRequestSchema
>

export const SessionLogoutRequestSchema = z.object({
  sessionId: z.string().min(1),
})

export type SessionLogoutRequest = z.infer<
  typeof SessionLogoutRequestSchema
>

export const SessionResponseSchema = z.object({
  accessToken: z.string(),
  sessionId: z.string(),
})

export type SessionResponse = z.infer<typeof SessionResponseSchema>
