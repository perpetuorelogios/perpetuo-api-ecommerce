import { prisma } from '../database/prisma.client.js'
import { OrderStatusHistory } from '../../domain/commerce/order/order-status-history.entity.js'
import type { OrderStatusHistoryRepository } from '../../domain/commerce/order/order-status-history.repository.js'

const toDomain = (row: {
  id: string
  orderId: string
  fromStatus: string
  toStatus: string
  changedBy: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new OrderStatusHistory(
    row.id,
    row.orderId,
    row.fromStatus as OrderStatusHistory['fromStatus'],
    row.toStatus as OrderStatusHistory['toStatus'],
    row.changedBy as OrderStatusHistory['changedBy'],
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaOrderStatusHistoryRepository
  implements OrderStatusHistoryRepository
{
  async listByOrderId(orderId: string) {
    const histories = await prisma.orderStatusHistory.findMany({
      where: { orderId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    })
    return histories.map(toDomain)
  }

  async create(history: OrderStatusHistory) {
    await prisma.orderStatusHistory.create({
      data: {
        id: history.id,
        orderId: history.orderId,
        fromStatus: history.fromStatus,
        toStatus: history.toStatus,
        changedBy: history.changedBy,
        createdAt: history.createdAt,
        updatedAt: history.updatedAt,
        deletedAt: history.deletedAt,
      },
    })
  }
}
