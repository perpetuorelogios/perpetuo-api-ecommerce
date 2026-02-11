import { z } from 'zod'
import { PaymentMethod, PaymentStatus } from '../../domain/commerce/shared/enums.js'

const PaymentCardSchema = z.object({
  holderName: z.string().min(1),
  number: z.string().min(12).max(19),
  expirationMonth: z.number().int().min(1).max(12),
  expirationYear: z.number().int().min(2020),
  cvv: z.string().min(3).max(4),
  brand: z.string().min(1),
})

export const PaymentCreateRequestSchema = z
  .object({
    orderId: z.string(),
    method: z.nativeEnum(PaymentMethod),
    installments: z.number().int().positive().optional(),
    paymentProfileId: z.string().optional(),
    savePaymentProfile: z.boolean().optional(),
    card: PaymentCardSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.savePaymentProfile) {
      if (data.method !== PaymentMethod.CreditCard) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['method'],
          message: 'savePaymentProfile only allowed for credit card',
        })
      }
      if (!data.card) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['card'],
          message: 'card is required when savePaymentProfile is true',
        })
      }
    }
  })

export type PaymentCreateRequest = z.infer<typeof PaymentCreateRequestSchema>

export const PaymentResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  paymentProfileId: z.string().nullable(),
  method: z.nativeEnum(PaymentMethod),
  amount: z.number(),
  installments: z.number().nullable(),
  status: z.nativeEnum(PaymentStatus),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type PaymentResponse = z.infer<typeof PaymentResponseSchema>
