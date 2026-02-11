import { BaseEntity } from '../shared/base.entity.js'
import { ShippingStatus } from '../shared/enums.js'

export class Shipping extends BaseEntity {
  constructor(
    id: string,
    public readonly orderId: string,
    public readonly status: ShippingStatus,
    public readonly carrier: string | null,
    public readonly trackingCode: string | null,
    public readonly shippedAt: Date | null,
    public readonly deliveredAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
