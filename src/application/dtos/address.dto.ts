import { z } from 'zod'

export const AddressCreateRequestSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(3),
  isDefault: z.boolean().optional(),
})

export type AddressCreateRequest = z.infer<
  typeof AddressCreateRequestSchema
>

export const AddressResponseSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type AddressResponse = z.infer<typeof AddressResponseSchema>
