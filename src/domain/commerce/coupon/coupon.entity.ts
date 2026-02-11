import { BaseEntity } from '../shared/base.entity.js'
import { CouponType } from '../shared/enums.js'

export class Coupon extends BaseEntity {
  constructor(
    id: string,
    public readonly code: string,
    public readonly type: CouponType,
    public readonly value: number,
    public readonly maxDiscountAmount: number | null,
    public readonly minOrderAmount: number | null,
    public readonly usageLimit: number | null,
    public readonly usedCount: number,
    public readonly startsAt: Date | null,
    public readonly expiresAt: Date | null,
    public readonly active: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
