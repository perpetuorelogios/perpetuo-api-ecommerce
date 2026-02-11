import type { FastifyInstance } from 'fastify'
import type { CouponRepository } from '../../../../../domain/commerce/coupon/coupon.repository.js'
import {
  CouponCreateRequestSchema,
  CouponResponseSchema,
} from '../../../../../application/dtos/coupon.dto.js'
import { CreateCouponUseCase } from '../../../../../application/commerce/coupon/create-coupon.usecase.js'
import { GetCouponUseCase } from '../../../../../application/commerce/coupon/get-coupon.usecase.js'

export function registerCouponRoutes(
  app: FastifyInstance,
  couponRepo: CouponRepository,
) {
  app.post('/coupons', async (req, reply) => {
    const body = CouponCreateRequestSchema.parse(req.body)
    const usecase = new CreateCouponUseCase(couponRepo)
    const result = await usecase.execute(body)
    return reply.code(201).send(CouponResponseSchema.parse(result))
  })

  app.get('/coupons/:code', async (req, reply) => {
    const { code } = req.params as { code: string }
    const usecase = new GetCouponUseCase(couponRepo)
    const result = await usecase.execute(code)
    return reply.code(200).send(CouponResponseSchema.parse(result))
  })
}
