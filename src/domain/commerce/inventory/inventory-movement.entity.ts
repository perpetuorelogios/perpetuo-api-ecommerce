import { BaseEntity } from '../shared/base.entity.js'
import {
  InventoryMovementReferenceType,
  InventoryMovementType,
} from '../shared/enums.js'

export class InventoryMovement extends BaseEntity {
  constructor(
    id: string,
    public readonly productId: string,
    public readonly type: InventoryMovementType,
    public readonly quantity: number,
    public readonly referenceType: InventoryMovementReferenceType,
    public readonly referenceId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
