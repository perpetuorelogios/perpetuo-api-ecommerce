import { prisma } from '../database/prisma.client.js'
import { Inventory } from '../../domain/commerce/inventory/inventory.entity.js'
import type { InventoryRepository } from '../../domain/commerce/inventory/inventory.repository.js'

const toDomain = (row: {
  id: string
  productId: string
  quantityAvailable: number
  quantityReserved: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new Inventory(
    row.id,
    row.productId,
    row.quantityAvailable,
    row.quantityReserved,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaInventoryRepository implements InventoryRepository {
  async findByProductId(productId: string) {
    const inventory = await prisma.inventory.findFirst({
      where: { productId, deletedAt: null },
    })
    return inventory ? toDomain(inventory) : null
  }

  async create(inventory: Inventory) {
    await prisma.inventory.create({
      data: {
        id: inventory.id,
        productId: inventory.productId,
        quantityAvailable: inventory.quantityAvailable,
        quantityReserved: inventory.quantityReserved,
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt,
        deletedAt: inventory.deletedAt,
      },
    })
  }

  async update(inventory: Inventory) {
    await prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        quantityAvailable: inventory.quantityAvailable,
        quantityReserved: inventory.quantityReserved,
        updatedAt: inventory.updatedAt,
        deletedAt: inventory.deletedAt,
      },
    })
  }
}
