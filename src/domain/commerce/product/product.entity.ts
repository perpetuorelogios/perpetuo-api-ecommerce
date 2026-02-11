import { BaseEntity } from '../shared/base.entity.js'

export class Product extends BaseEntity {
  constructor(
    id: string,
    public readonly name: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly sku: string,
    public readonly price: number,
    public readonly description: string | null,
    public readonly isPreorder: boolean,
    public readonly active: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
