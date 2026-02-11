import { Inventory } from './inventory.entity.js'

export interface InventoryRepository {
  findByProductId(productId: string): Promise<Inventory | null>
  create(inventory: Inventory): Promise<void>
  update(inventory: Inventory): Promise<void>
}
