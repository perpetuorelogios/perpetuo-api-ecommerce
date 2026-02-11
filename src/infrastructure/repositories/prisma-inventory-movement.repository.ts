import { prisma } from '../database/prisma.client.js'
import { InventoryMovement } from '../../domain/commerce/inventory/inventory-movement.entity.js'
import type { InventoryMovementRepository } from '../../domain/commerce/inventory/inventory-movement.repository.js'

const toDomain = (row: {
  id: string
  productId: string
  type: string
  quantity: number
  referenceType: string
  referenceId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new InventoryMovement(
    row.id,
    row.productId,
    row.type as InventoryMovement['type'],
    row.quantity,
    row.referenceType as InventoryMovement['referenceType'],
    row.referenceId,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaInventoryMovementRepository
  implements InventoryMovementRepository
{
  async listByProductId(productId: string) {
    const movements = await prisma.inventoryMovement.findMany({
      where: { productId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
    return movements.map(toDomain)
  }

  async create(movement: InventoryMovement) {
    await prisma.inventoryMovement.create({
      data: {
        id: movement.id,
        productId: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        referenceType: movement.referenceType,
        referenceId: movement.referenceId,
        createdAt: movement.createdAt,
        updatedAt: movement.updatedAt,
        deletedAt: movement.deletedAt,
      },
    })
  }
}
