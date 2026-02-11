import { z } from 'zod'
import { CouponType } from '../../domain/commerce/shared/enums.js'

export const CouponCreateRequestSchema = z.object({
  code: z.string().min(1),
  type: z.nativeEnum(CouponType),
  value: z.number().nonnegative(),
  maxDiscountAmount: z.number().nonnegative().optional(),
  minOrderAmount: z.number().nonnegative().optional(),
  usageLimit: z.number().int().positive().optional(),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  active: z.boolean().optional(),
})

export type CouponCreateRequest = z.infer<typeof CouponCreateRequestSchema>

export const CouponResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  type: z.nativeEnum(CouponType),
  value: z.number(),
  maxDiscountAmount: z.number().nullable(),
  minOrderAmount: z.number().nullable(),
  usageLimit: z.number().nullable(),
  usedCount: z.number(),
  startsAt: z.string().datetime().nullable(),
  expiresAt: z.string().datetime().nullable(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})

export type CouponResponse = z.infer<typeof CouponResponseSchema>
