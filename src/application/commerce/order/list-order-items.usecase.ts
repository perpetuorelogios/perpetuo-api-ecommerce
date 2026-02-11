import type { OrderItemRepository } from '../../../domain/commerce/order/order-item.repository.js'
import type { OrderItemResponse } from '../../dtos/order.dto.js'

export class ListOrderItemsUseCase {
  constructor(private orderItemRepo: OrderItemRepository) {}

  async execute(orderId: string): Promise<OrderItemResponse[]> {
    const items = await this.orderItemRepo.listByOrderId(orderId)
    return items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      deletedAt: item.deletedAt?.toISOString() ?? null,
    }))
  }
}
