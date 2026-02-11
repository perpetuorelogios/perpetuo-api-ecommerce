import { z } from 'zod'
import {
  PaymentProfileType,
  PaymentProvider,
} from '../../domain/commerce/shared/enums.js'

export const PaymentProfileCreateRequestSchema = z.object({
  type: z.nativeEnum(PaymentProfileType),
  brand: z.string().min(1),
  last4: z.string().min(4).max(4),
  holderName: z.string().min(1),
  expirationMonth: z.number().int().min(1).max(12),
  expirationYear: z.number().int().min(2020),
  provider: z.nativeEnum(PaymentProvider),
  externalToken: z.string().min(1),
  isDefault: z.boolean().optional(),
})

export type PaymentProfileCreateRequest = z.infer<
  typeof PaymentProfileCreateRequestSchema
>

export const PaymentProfileResponseSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  type: z.nativeEnum(PaymentProfileType),
  brand: z.string(),
  last4: z.string(),
  holderName: z.string(),
  expirationMonth: z.number(),
  expirationYear: z.number(),
  provider: z.nativeEnum(PaymentProvider),
  externalToken: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type PaymentProfileResponse = z.infer<
  typeof PaymentProfileResponseSchema
>
