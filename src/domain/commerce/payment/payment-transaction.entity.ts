import { BaseEntity } from '../shared/base.entity.js'
import { PaymentProvider } from '../shared/enums.js'

export class PaymentTransaction extends BaseEntity {
  constructor(
    id: string,
    public readonly paymentId: string,
    public readonly provider: PaymentProvider,
    public readonly externalId: string,
    public readonly status: string,
    public readonly payload: Record<string, unknown>,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
