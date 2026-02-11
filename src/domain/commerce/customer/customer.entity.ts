import { BaseEntity } from '../shared/base.entity.js'
import { UserRole } from '../shared/enums.js'

export class Customer extends BaseEntity {
  constructor(
    id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly document: string,
    public readonly phone: string,
    public readonly role: UserRole,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
