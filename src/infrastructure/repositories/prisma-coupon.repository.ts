import { prisma } from '../database/prisma.client.js'
import { Coupon } from '../../domain/commerce/coupon/coupon.entity.js'
import type { CouponRepository } from '../../domain/commerce/coupon/coupon.repository.js'

const toDomain = (row: {
  id: string
  code: string
  type: string
  value: { toNumber(): number }
  maxDiscountAmount: { toNumber(): number } | null
  minOrderAmount: { toNumber(): number } | null
  usageLimit: number | null
  usedCount: number
  startsAt: Date | null
  expiresAt: Date | null
  active: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new Coupon(
    row.id,
    row.code,
    row.type as Coupon['type'],
    row.value.toNumber(),
    row.maxDiscountAmount ? row.maxDiscountAmount.toNumber() : null,
    row.minOrderAmount ? row.minOrderAmount.toNumber() : null,
    row.usageLimit,
    row.usedCount,
    row.startsAt,
    row.expiresAt,
    row.active,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaCouponRepository implements CouponRepository {
  async findById(id: string) {
    const coupon = await prisma.coupon.findFirst({
      where: { id, deletedAt: null },
    })
    return coupon ? toDomain(coupon) : null
  }

  async findByCode(code: string) {
    const coupon = await prisma.coupon.findFirst({
      where: { code, deletedAt: null },
    })
    return coupon ? toDomain(coupon) : null
  }

  async create(coupon: Coupon) {
    await prisma.coupon.create({
      data: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        maxDiscountAmount: coupon.maxDiscountAmount,
        minOrderAmount: coupon.minOrderAmount,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        startsAt: coupon.startsAt,
        expiresAt: coupon.expiresAt,
        active: coupon.active,
        createdAt: coupon.createdAt,
        updatedAt: coupon.updatedAt,
        deletedAt: coupon.deletedAt,
      },
    })
  }

  async update(coupon: Coupon) {
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        maxDiscountAmount: coupon.maxDiscountAmount,
        minOrderAmount: coupon.minOrderAmount,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        startsAt: coupon.startsAt,
        expiresAt: coupon.expiresAt,
        active: coupon.active,
        updatedAt: coupon.updatedAt,
        deletedAt: coupon.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.coupon.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
