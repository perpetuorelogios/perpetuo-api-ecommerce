import { BaseEntity } from '../shared/base.entity.js'

export class Inventory extends BaseEntity {
  constructor(
    id: string,
    public readonly productId: string,
    public readonly quantityAvailable: number,
    public readonly quantityReserved: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
