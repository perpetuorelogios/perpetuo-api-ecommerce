import { prisma } from '../database/prisma.client.js'
import { OrderItem } from '../../domain/commerce/order/order-item.entity.js'
import type { OrderItemRepository } from '../../domain/commerce/order/order-item.repository.js'

const toDomain = (row: {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: { toNumber(): number }
  totalPrice: { toNumber(): number }
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new OrderItem(
    row.id,
    row.orderId,
    row.productId,
    row.quantity,
    row.unitPrice.toNumber(),
    row.totalPrice.toNumber(),
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaOrderItemRepository implements OrderItemRepository {
  async listByOrderId(orderId: string) {
    const items = await prisma.orderItem.findMany({
      where: { orderId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    })
    return items.map(toDomain)
  }

  async create(item: OrderItem) {
    await prisma.orderItem.create({
      data: {
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.orderItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
