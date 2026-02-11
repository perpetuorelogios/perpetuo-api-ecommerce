import { Shipping } from '../../../domain/commerce/shipping/shipping.entity.js'
import type { ShippingRepository } from '../../../domain/commerce/shipping/shipping.repository.js'
import type { ShippingCreateRequest, ShippingResponse } from '../../dtos/shipping.dto.js'
import { ShippingStatus } from '../../../domain/commerce/shared/enums.js'

export class CreateShippingUseCase {
  constructor(private shippingRepo: ShippingRepository) {}

  async execute(orderId: string, data: ShippingCreateRequest): Promise<ShippingResponse> {
    const now = new Date()
    const shipping = new Shipping(
      crypto.randomUUID(),
      orderId,
      data.status ?? ShippingStatus.Pending,
      data.carrier ?? null,
      data.trackingCode ?? null,
      null,
      null,
      now,
      now,
      null,
    )

    await this.shippingRepo.create(shipping)

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
