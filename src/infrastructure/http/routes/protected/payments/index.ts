import type { FastifyInstance } from 'fastify'
import type { PaymentRepository } from '../../../../../domain/commerce/payment/payment.repository.js'
import type { PaymentService } from '../../../../../application/commerce/payment/payment.service.js'
import {
  PaymentCreateRequestSchema,
  PaymentResponseSchema,
} from '../../../../../application/dtos/payment.dto.js'
import { CreatePaymentUseCase } from '../../../../../application/commerce/payment/create-payment.usecase.js'
import { GetOrderPaymentUseCase } from '../../../../../application/commerce/payment/get-order-payment.usecase.js'
import { Logger } from '../../../../logging/logger.js'

export function registerPaymentRoutes(
  app: FastifyInstance,
  paymentService: PaymentService,
  paymentRepo: PaymentRepository,
) {
  app.post('/payments', async (req, reply) => {
    const body = PaymentCreateRequestSchema.parse(req.body)
    const usecase = new CreatePaymentUseCase(paymentService, new Logger())
    const result = await usecase.execute(body)
    return reply.code(201).send(PaymentResponseSchema.parse(result))
  })

  app.get('/orders/:id/payment', async (req, reply) => {
    const { id } = req.params as { id: string }
    const usecase = new GetOrderPaymentUseCase(paymentRepo)
    const result = await usecase.execute(id)
    return reply.code(200).send(PaymentResponseSchema.parse(result))
  })
}
