import { BaseEntity } from '../shared/base.entity.js'

export class OrderItem extends BaseEntity {
  constructor(
    id: string,
    public readonly orderId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
