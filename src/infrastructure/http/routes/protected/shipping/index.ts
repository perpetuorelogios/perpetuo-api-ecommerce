import type { FastifyInstance } from 'fastify'
import type { ShippingRepository } from '../../../../../domain/commerce/shipping/shipping.repository.js'
import {
  ShippingCreateRequestSchema,
  ShippingResponseSchema,
} from '../../../../../application/dtos/shipping.dto.js'
import { CreateShippingUseCase } from '../../../../../application/commerce/shipping/create-shipping.usecase.js'
import { GetShippingUseCase } from '../../../../../application/commerce/shipping/get-shipping.usecase.js'
import { Logger } from '../../../../logging/logger.js'

export function registerShippingRoutes(
  app: FastifyInstance,
  shippingRepo: ShippingRepository,
) {
  app.post('/orders/:orderId/shipping', async (req, reply) => {
    const { orderId } = req.params as { orderId: string }
    const body = ShippingCreateRequestSchema.parse(req.body)
    const usecase = new CreateShippingUseCase(shippingRepo)
    const result = await usecase.execute(orderId, body)
    return reply.code(201).send(ShippingResponseSchema.parse(result))
  })

  app.get('/orders/:orderId/shipping', async (req, reply) => {
    const { orderId } = req.params as { orderId: string }
    const usecase = new GetShippingUseCase(shippingRepo)
    const result = await usecase.execute(orderId)
    return reply.code(200).send(ShippingResponseSchema.parse(result))
  })
}
