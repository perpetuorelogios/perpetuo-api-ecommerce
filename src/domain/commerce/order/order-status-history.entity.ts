import { BaseEntity } from '../shared/base.entity.js'
import { OrderStatus, OrderStatusChangedBy } from '../shared/enums.js'

export class OrderStatusHistory extends BaseEntity {
  constructor(
    id: string,
    public readonly orderId: string,
    public readonly fromStatus: OrderStatus,
    public readonly toStatus: OrderStatus,
    public readonly changedBy: OrderStatusChangedBy,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
