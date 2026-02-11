import { z } from 'zod'

export const CustomerCreateRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  document: z.string().min(5),
  phone: z.string().min(5),
})

export type CustomerCreateRequest = z.infer<
  typeof CustomerCreateRequestSchema
>

export const CustomerResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  document: z.string(),
  phone: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type CustomerResponse = z.infer<typeof CustomerResponseSchema>
