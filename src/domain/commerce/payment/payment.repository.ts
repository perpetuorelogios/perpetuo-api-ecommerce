import { Payment } from './payment.entity.js'

export interface PaymentRepository {
  findById(id: string): Promise<Payment | null>
  findByOrderId(orderId: string): Promise<Payment | null>
  create(payment: Payment): Promise<void>
  update(payment: Payment): Promise<void>
}
