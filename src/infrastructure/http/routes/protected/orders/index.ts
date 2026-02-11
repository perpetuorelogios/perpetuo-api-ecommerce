import type { FastifyInstance } from 'fastify'
import type { OrderRepository } from '../../../../../domain/commerce/order/order.repository.js'
import type { OrderItemRepository } from '../../../../../domain/commerce/order/order-item.repository.js'
import type { OrderStatusHistoryRepository } from '../../../../../domain/commerce/order/order-status-history.repository.js'
import type { ProductRepository } from '../../../../../domain/commerce/product/product.repository.js'
import type { InventoryRepository } from '../../../../../domain/commerce/inventory/inventory.repository.js'
import type { InventoryMovementRepository } from '../../../../../domain/commerce/inventory/inventory-movement.repository.js'
import type { CouponRepository } from '../../../../../domain/commerce/coupon/coupon.repository.js'
import type { ProductRequestRepository } from '../../../../../domain/commerce/product-request/product-request.repository.js'
import {
  OrderCreateRequestSchema,
  OrderItemResponseSchema,
  OrderResponseSchema,
} from '../../../../../application/dtos/order.dto.js'
import { CreateOrderUseCase } from '../../../../../application/commerce/order/create-order.usecase.js'
import { GetOrderUseCase } from '../../../../../application/commerce/order/get-order.usecase.js'
import { ListOrderItemsUseCase } from '../../../../../application/commerce/order/list-order-items.usecase.js'
import { z } from 'zod'
import { Logger } from '../../../../logging/logger.js'

export function registerOrderRoutes(
  app: FastifyInstance,
  orderRepo: OrderRepository,
  orderItemRepo: OrderItemRepository,
  productRepo: ProductRepository,
  inventoryRepo: InventoryRepository,
  inventoryMovementRepo: InventoryMovementRepository,
  couponRepo: CouponRepository,
  productRequestRepo: ProductRequestRepository,
  orderStatusHistoryRepo: OrderStatusHistoryRepository,
) {
  app.post('/orders', async (req, reply) => {
    const body = OrderCreateRequestSchema.parse(req.body)
    const usecase = new CreateOrderUseCase(
      orderRepo,
      orderItemRepo,
      productRepo,
      inventoryRepo,
      inventoryMovementRepo,
      couponRepo,
      productRequestRepo,
      orderStatusHistoryRepo,
      new Logger(),
    )
    const result = await usecase.execute(body)
    return reply.code(201).send(OrderResponseSchema.parse(result))
  })

  app.get('/orders/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const usecase = new GetOrderUseCase(orderRepo)
    const result = await usecase.execute(id)
    return reply.code(200).send(OrderResponseSchema.parse(result))
  })

  app.get('/orders/:id/items', async (req, reply) => {
    const { id } = req.params as { id: string }
    const usecase = new ListOrderItemsUseCase(orderItemRepo)
    const result = await usecase.execute(id)
    return reply
      .code(200)
      .send(z.array(OrderItemResponseSchema).parse(result))
  })
}
