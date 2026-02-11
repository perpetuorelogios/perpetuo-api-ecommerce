import { Shipping } from './shipping.entity.js'

export interface ShippingRepository {
  findByOrderId(orderId: string): Promise<Shipping | null>
  create(shipping: Shipping): Promise<void>
  update(shipping: Shipping): Promise<void>
}
