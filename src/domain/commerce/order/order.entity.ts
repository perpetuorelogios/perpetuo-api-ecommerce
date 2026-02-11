import { BaseEntity } from '../shared/base.entity.js'
import { OrderStatus } from '../shared/enums.js'

export class Order extends BaseEntity {
  constructor(
    id: string,
    public readonly customerId: string,
    public readonly addressId: string,
    public readonly couponId: string | null,
    public readonly productRequestId: string | null,
    public readonly isPreorder: boolean,
    public readonly status: OrderStatus,
    public readonly subtotalAmount: number,
    public readonly discountAmount: number,
    public readonly totalAmount: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
