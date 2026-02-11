import { BaseEntity } from '../shared/base.entity.js'
import { ProductRequestStatus } from '../shared/enums.js'

export class ProductRequest extends BaseEntity {
  constructor(
    id: string,
    public readonly customerId: string,
    public readonly productId: string,
    public readonly paymentLinkId: string | null,
    public readonly quantity: number,
    public readonly status: ProductRequestStatus,
    public readonly paymentLinkUrl: string | null,
    public readonly notes: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
