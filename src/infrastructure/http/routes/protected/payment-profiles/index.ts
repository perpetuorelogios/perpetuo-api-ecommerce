import type { FastifyInstance } from 'fastify'
import type { PaymentProfileRepository } from '../../../../../domain/commerce/payment/payment-profile.repository.js'
import {
  PaymentProfileCreateRequestSchema,
  PaymentProfileResponseSchema,
} from '../../../../../application/dtos/payment-profile.dto.js'
import { CreatePaymentProfileUseCase } from '../../../../../application/commerce/payment-profile/create-payment-profile.usecase.js'
import { ListPaymentProfilesUseCase } from '../../../../../application/commerce/payment-profile/list-payment-profiles.usecase.js'
import { z } from 'zod'
import { Logger } from '../../../../logging/logger.js'

export function registerPaymentProfileRoutes(
  app: FastifyInstance,
  paymentProfileRepo: PaymentProfileRepository,
) {
  app.post('/customers/:customerId/payment-profiles', async (req, reply) => {
    const { customerId } = req.params as { customerId: string }
    const body = PaymentProfileCreateRequestSchema.parse(req.body)
    const usecase = new CreatePaymentProfileUseCase(
      paymentProfileRepo,
    )
    const result = await usecase.execute(customerId, body)
    return reply.code(201).send(PaymentProfileResponseSchema.parse(result))
  })

  app.get('/customers/:customerId/payment-profiles', async (req, reply) => {
    const { customerId } = req.params as { customerId: string }
    const usecase = new ListPaymentProfilesUseCase(paymentProfileRepo)
    const result = await usecase.execute(customerId)
    return reply
      .code(200)
      .send(z.array(PaymentProfileResponseSchema).parse(result))
  })
}
