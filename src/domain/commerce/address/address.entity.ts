import { BaseEntity } from '../shared/base.entity.js'

export class Address extends BaseEntity {
  constructor(
    id: string,
    public readonly customerId: string,
    public readonly street: string,
    public readonly number: string,
    public readonly complement: string | null,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
    public readonly isDefault: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
