import { z } from 'zod'

export const ProductCreateRequestSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  isPreorder: z.boolean().optional(),
  active: z.boolean().optional(),
  quantityAvailable: z.number().int().nonnegative().optional(),
})

export type ProductCreateRequest = z.infer<
  typeof ProductCreateRequestSchema
>

export const ProductUpdateRequestSchema = z.object({
  name: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  description: z.string().optional(),
  isPreorder: z.boolean().optional(),
  active: z.boolean().optional(),
})

export type ProductUpdateRequest = z.infer<
  typeof ProductUpdateRequestSchema
>

export const ProductResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  model: z.string(),
  sku: z.string(),
  price: z.number(),
  description: z.string().nullable(),
  isPreorder: z.boolean(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type ProductResponse = z.infer<typeof ProductResponseSchema>
