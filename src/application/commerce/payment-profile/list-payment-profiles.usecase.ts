import type { PaymentProfileRepository } from '../../../domain/commerce/payment/payment-profile.repository.js'
import type { PaymentProfileResponse } from '../../dtos/payment-profile.dto.js'

export class ListPaymentProfilesUseCase {
  constructor(private paymentProfileRepo: PaymentProfileRepository) {}

  async execute(customerId: string): Promise<PaymentProfileResponse[]> {
    const profiles = await this.paymentProfileRepo.listByCustomerId(customerId)
    return profiles.map((profile) => ({
      id: profile.id,
      customerId: profile.customerId,
      type: profile.type,
      brand: profile.brand,
      last4: profile.last4,
      holderName: profile.holderName,
      expirationMonth: profile.expirationMonth,
      expirationYear: profile.expirationYear,
      provider: profile.provider,
      externalToken: profile.externalToken,
      isDefault: profile.isDefault,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      deletedAt: profile.deletedAt?.toISOString() ?? null,
    }))
  }
}
