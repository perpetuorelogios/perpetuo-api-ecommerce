import { BaseEntity } from '../shared/base.entity.js'
import { PaymentMethod, PaymentStatus } from '../shared/enums.js'

export class Payment extends BaseEntity {
  constructor(
    id: string,
    public readonly orderId: string,
    public readonly paymentProfileId: string | null,
    public readonly method: PaymentMethod,
    public readonly amount: number,
    public readonly installments: number | null,
    public readonly status: PaymentStatus,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
