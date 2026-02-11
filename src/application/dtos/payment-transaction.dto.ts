import { z } from 'zod'
import { PaymentProvider } from '../../domain/commerce/shared/enums.js'

export const PaymentTransactionResponseSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  provider: z.nativeEnum(PaymentProvider),
  externalId: z.string(),
  status: z.string(),
  payload: z.record(z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type PaymentTransactionResponse = z.infer<
  typeof PaymentTransactionResponseSchema
>
