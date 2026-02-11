import { z } from 'zod'
import { ShippingStatus } from '../../domain/commerce/shared/enums.js'

export const ShippingCreateRequestSchema = z.object({
  status: z.nativeEnum(ShippingStatus).optional(),
  carrier: z.string().optional(),
  trackingCode: z.string().optional(),
})

export type ShippingCreateRequest = z.infer<typeof ShippingCreateRequestSchema>

export const ShippingResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  status: z.nativeEnum(ShippingStatus),
  carrier: z.string().nullable(),
  trackingCode: z.string().nullable(),
  shippedAt: z.string().datetime().nullable(),
  deliveredAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type ShippingResponse = z.infer<typeof ShippingResponseSchema>
