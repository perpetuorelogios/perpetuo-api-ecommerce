import type { CouponRepository } from '../../../domain/commerce/coupon/coupon.repository.js'
import { AppError } from '../../shared/app-error.js'
import type { CouponResponse } from '../../dtos/coupon.dto.js'

export class GetCouponUseCase {
  constructor(private couponRepo: CouponRepository) {}

  async execute(code: string): Promise<CouponResponse> {
    const coupon = await this.couponRepo.findByCode(code)
    if (!coupon) {
      throw new AppError('Coupon not found', 404)
    }

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
