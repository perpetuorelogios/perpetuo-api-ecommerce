import { InventoryMovement } from './inventory-movement.entity.js'

export interface InventoryMovementRepository {
  listByProductId(productId: string): Promise<InventoryMovement[]>
  create(movement: InventoryMovement): Promise<void>
}
