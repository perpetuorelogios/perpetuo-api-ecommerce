import { PaymentLink } from './payment-link.entity.js'

export interface PaymentLinkRepository {
  findById(id: string): Promise<PaymentLink | null>
  findByProviderId(providerId: string): Promise<PaymentLink | null>
  create(link: PaymentLink): Promise<void>
  update(link: PaymentLink): Promise<void>
  softDelete(id: string): Promise<void>
}
