import type { FastifyInstance } from 'fastify'
import type { ProductRepository } from '../../../../../domain/commerce/product/product.repository.js'
import type { ProductRequestRepository } from '../../../../../domain/commerce/product-request/product-request.repository.js'
import type { PaymentLinkRepository } from '../../../../../domain/commerce/payment-link/payment-link.repository.js'
import type { PaymentGateway } from '../../../../../application/commerce/payment/payment-gateway.js'
import {
  ProductRequestCreateSchema,
  ProductRequestQuoteSchema,
  ProductRequestResponseSchema,
} from '../../../../../application/dtos/product-request.dto.js'
import { CreateProductRequestUseCase } from '../../../../../application/commerce/product-request/create-product-request.usecase.js'
import { ListProductRequestsUseCase } from '../../../../../application/commerce/product-request/list-product-requests.usecase.js'
import { QuoteProductRequestUseCase } from '../../../../../application/commerce/product-request/quote-product-request.usecase.js'
import { CompleteProductRequestUseCase } from '../../../../../application/commerce/product-request/complete-product-request.usecase.js'
import { Logger } from '../../../../logging/logger.js'
import { z } from 'zod'

export function registerProductRequestRoutes(
  app: FastifyInstance,
  productRequestRepo: ProductRequestRepository,
  productRepo: ProductRepository,
  paymentLinkRepo: PaymentLinkRepository,
  paymentGateway: PaymentGateway,
) {
  app.post('/product-requests', async (req, reply) => {
    const body = ProductRequestCreateSchema.parse(req.body)
    const usecase = new CreateProductRequestUseCase(
      productRequestRepo,
      productRepo,
      paymentLinkRepo,
      paymentGateway,
      new Logger(),
    )
    const result = await usecase.execute(body)
    return reply.code(201).send(ProductRequestResponseSchema.parse(result))
  })

  app.get('/customers/:customerId/product-requests', async (req, reply) => {
    const { customerId } = req.params as { customerId: string }
    const usecase = new ListProductRequestsUseCase(productRequestRepo)
    const result = await usecase.execute(customerId)
    return reply
      .code(200)
      .send(z.array(ProductRequestResponseSchema).parse(result))
  })

  app.patch('/product-requests/:id/quote', async (req, reply) => {
    const { id } = req.params as { id: string }
    const body = ProductRequestQuoteSchema.parse(req.body)
    const usecase = new QuoteProductRequestUseCase(
      productRequestRepo,
      paymentLinkRepo,
      new Logger(),
    )
    const result = await usecase.execute(id, body)
    return reply.code(200).send(ProductRequestResponseSchema.parse(result))
  })

  app.patch('/product-requests/:id/complete', async (req, reply) => {
    const { id } = req.params as { id: string }
    const usecase = new CompleteProductRequestUseCase(
      productRequestRepo,
      new Logger(),
    )
    await usecase.execute(id)
    return reply.code(204).send()
  })
}
