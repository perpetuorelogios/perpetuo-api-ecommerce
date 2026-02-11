import type { OrderRepository } from '../../../domain/commerce/order/order.repository.js'
import { AppError } from '../../shared/app-error.js'
import type { OrderResponse } from '../../dtos/order.dto.js'

export class GetOrderUseCase {
  constructor(private orderRepo: OrderRepository) {}

  async execute(id: string): Promise<OrderResponse> {
    const order = await this.orderRepo.findById(id)
    if (!order) {
      throw new AppError('Order not found', 404)
    }

    return {
      id: order.id,
      customerId: order.customerId,
      addressId: order.addressId,
      couponId: order.couponId,
      productRequestId: order.productRequestId,
      isPreorder: order.isPreorder,
      status: order.status,
      subtotalAmount: order.subtotalAmount,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      deletedAt: order.deletedAt?.toISOString() ?? null,
    }
  }
}
