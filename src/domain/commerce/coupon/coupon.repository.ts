import { Coupon } from './coupon.entity.js'

export interface CouponRepository {
  findById(id: string): Promise<Coupon | null>
  findByCode(code: string): Promise<Coupon | null>
  create(coupon: Coupon): Promise<void>
  update(coupon: Coupon): Promise<void>
  softDelete(id: string): Promise<void>
}
