import { Coupon } from '../../../domain/commerce/coupon/coupon.entity.js'
import type { CouponRepository } from '../../../domain/commerce/coupon/coupon.repository.js'
import type { CouponCreateRequest, CouponResponse } from '../../dtos/coupon.dto.js'

export class CreateCouponUseCase {
  constructor(private couponRepo: CouponRepository) {}

  async execute(data: CouponCreateRequest): Promise<CouponResponse> {
    const now = new Date()
    const coupon = new Coupon(
      crypto.randomUUID(),
      data.code,
      data.type,
      data.value,
      data.maxDiscountAmount ?? null,
      data.minOrderAmount ?? null,
      data.usageLimit ?? null,
      0,
      data.startsAt ? new Date(data.startsAt) : null,
      data.expiresAt ? new Date(data.expiresAt) : null,
      data.active ?? true,
      now,
      now,
      null,
    )

    await this.couponRepo.create(coupon)

    return {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minOrderAmount: coupon.minOrderAmount,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      startsAt: coupon.startsAt?.toISOString() ?? null,
      expiresAt: coupon.expiresAt?.toISOString() ?? null,
      active: coupon.active,
      createdAt: coupon.createdAt.toISOString(),
      updatedAt: coupon.updatedAt.toISOString(),
      deletedAt: coupon.deletedAt?.toISOString() ?? null,
    }
  }
}
