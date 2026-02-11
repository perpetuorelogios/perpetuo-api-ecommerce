import { prisma } from '../database/prisma.client.js'
import { Order } from '../../domain/commerce/order/order.entity.js'
import type { OrderRepository } from '../../domain/commerce/order/order.repository.js'

const toDomain = (row: {
  id: string
  customerId: string
  addressId: string
  couponId: string | null
  productRequestId: string | null
  isPreorder: boolean
  status: string
  subtotalAmount: { toNumber(): number }
  discountAmount: { toNumber(): number }
  totalAmount: { toNumber(): number }
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new Order(
    row.id,
    row.customerId,
    row.addressId,
    row.couponId,
    row.productRequestId,
    row.isPreorder,
    row.status as Order['status'],
    row.subtotalAmount.toNumber(),
    row.discountAmount.toNumber(),
    row.totalAmount.toNumber(),
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaOrderRepository implements OrderRepository {
  async findById(id: string) {
    const order = await prisma.order.findFirst({
      where: { id, deletedAt: null },
    })
    return order ? toDomain(order) : null
  }

  async listByCustomerId(customerId: string) {
    const orders = await prisma.order.findMany({
      where: { customerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
    return orders.map(toDomain)
  }

  async findByProductRequestId(productRequestId: string) {
    const order = await prisma.order.findFirst({
      where: { productRequestId, deletedAt: null },
    })
    return order ? toDomain(order) : null
  }

  async create(order: Order) {
    await prisma.order.create({
      data: {
        id: order.id,
        customerId: order.customerId,
        addressId: order.addressId,
        couponId: order.couponId,
        productRequestId: order.productRequestId,
        isPreorder: order.isPreorder,
        status: order.status,
        subtotalAmount: order.subtotalAmount,
        discountAmount: order.discountAmount,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deletedAt: order.deletedAt,
      },
    })
  }

  async update(order: Order) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: order.status,
        subtotalAmount: order.subtotalAmount,
        discountAmount: order.discountAmount,
        totalAmount: order.totalAmount,
        productRequestId: order.productRequestId,
        isPreorder: order.isPreorder,
        updatedAt: order.updatedAt,
        deletedAt: order.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
