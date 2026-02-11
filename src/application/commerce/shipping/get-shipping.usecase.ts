import type { ShippingRepository } from '../../../domain/commerce/shipping/shipping.repository.js'
import { AppError } from '../../shared/app-error.js'
import type { ShippingResponse } from '../../dtos/shipping.dto.js'

export class GetShippingUseCase {
  constructor(private shippingRepo: ShippingRepository) {}

  async execute(orderId: string): Promise<ShippingResponse> {
    const shipping = await this.shippingRepo.findByOrderId(orderId)
    if (!shipping) {
      throw new AppError('Shipping not found', 404)
    }

    return {
      id: shipping.id,
      orderId: shipping.orderId,
      status: shipping.status,
      carrier: shipping.carrier,
      trackingCode: shipping.trackingCode,
      shippedAt: shipping.shippedAt?.toISOString() ?? null,
      deliveredAt: shipping.deliveredAt?.toISOString() ?? null,
      createdAt: shipping.createdAt.toISOString(),
      updatedAt: shipping.updatedAt.toISOString(),
      deletedAt: shipping.deletedAt?.toISOString() ?? null,
    }
  }
}
