import { PaymentProfile } from './payment-profile.entity.js'

export interface PaymentProfileRepository {
  findById(id: string): Promise<PaymentProfile | null>
  listByCustomerId(customerId: string): Promise<PaymentProfile[]>
  create(profile: PaymentProfile): Promise<void>
  update(profile: PaymentProfile): Promise<void>
  softDelete(id: string): Promise<void>
}
