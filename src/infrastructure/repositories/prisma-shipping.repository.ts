import { prisma } from '../database/prisma.client.js'
import { Shipping } from '../../domain/commerce/shipping/shipping.entity.js'
import type { ShippingRepository } from '../../domain/commerce/shipping/shipping.repository.js'

const toDomain = (row: {
  id: string
  orderId: string
  status: string
  carrier: string | null
  trackingCode: string | null
  shippedAt: Date | null
  deliveredAt: Date | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new Shipping(
    row.id,
    row.orderId,
    row.status as Shipping['status'],
    row.carrier,
    row.trackingCode,
    row.shippedAt,
    row.deliveredAt,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaShippingRepository implements ShippingRepository {
  async findByOrderId(orderId: string) {
    const shipping = await prisma.shipping.findFirst({
      where: { orderId, deletedAt: null },
    })
    return shipping ? toDomain(shipping) : null
  }

  async create(shipping: Shipping) {
    await prisma.shipping.create({
      data: {
        id: shipping.id,
        orderId: shipping.orderId,
        status: shipping.status,
        carrier: shipping.carrier,
        trackingCode: shipping.trackingCode,
        shippedAt: shipping.shippedAt,
        deliveredAt: shipping.deliveredAt,
        createdAt: shipping.createdAt,
        updatedAt: shipping.updatedAt,
        deletedAt: shipping.deletedAt,
      },
    })
  }

  async update(shipping: Shipping) {
    await prisma.shipping.update({
      where: { id: shipping.id },
      data: {
        status: shipping.status,
        carrier: shipping.carrier,
        trackingCode: shipping.trackingCode,
        shippedAt: shipping.shippedAt,
        deliveredAt: shipping.deliveredAt,
        updatedAt: shipping.updatedAt,
        deletedAt: shipping.deletedAt,
      },
    })
  }
}
