import { z } from 'zod'
import { OrderStatus } from '../../domain/commerce/shared/enums.js'

export const OrderItemInputSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
})

export const OrderItemResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>

export const OrderCreateRequestSchema = z
  .object({
    customerId: z.string(),
    addressId: z.string(),
    couponCode: z.string().optional(),
    productRequestId: z.string().optional(),
    isPreorder: z.boolean().optional(),
    items: z.array(OrderItemInputSchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (data.isPreorder && !data.productRequestId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['productRequestId'],
        message: 'productRequestId is required when isPreorder is true',
      })
    }
    if (data.productRequestId && !data.isPreorder) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['isPreorder'],
        message: 'isPreorder must be true when productRequestId is provided',
      })
    }
  })

export type OrderCreateRequest = z.infer<typeof OrderCreateRequestSchema>

export const OrderResponseSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  addressId: z.string(),
  couponId: z.string().nullable(),
  productRequestId: z.string().nullable(),
  isPreorder: z.boolean(),
  status: z.nativeEnum(OrderStatus),
  subtotalAmount: z.number(),
  discountAmount: z.number(),
  totalAmount: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type OrderResponse = z.infer<typeof OrderResponseSchema>
