import { z } from 'zod'
import { ProductRequestStatus } from '../../domain/commerce/shared/enums.js'

export const ProductRequestCreateSchema = z.object({
  customerId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
})

export type ProductRequestCreate = z.infer<typeof ProductRequestCreateSchema>

export const ProductRequestQuoteSchema = z.object({
  paymentLinkUrl: z.string().url(),
})

export type ProductRequestQuote = z.infer<typeof ProductRequestQuoteSchema>

export const ProductRequestResponseSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  productId: z.string(),
  paymentLinkId: z.string().nullable(),
  quantity: z.number(),
  status: z.nativeEnum(ProductRequestStatus),
  paymentLinkUrl: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type ProductRequestResponse = z.infer<
  typeof ProductRequestResponseSchema
>
