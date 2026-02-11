import { PaymentProfile } from '../../../domain/commerce/payment/payment-profile.entity.js'
import type { PaymentProfileRepository } from '../../../domain/commerce/payment/payment-profile.repository.js'
import type { PaymentProfileCreateRequest, PaymentProfileResponse } from '../../dtos/payment-profile.dto.js'

export class CreatePaymentProfileUseCase {
  constructor(private paymentProfileRepo: PaymentProfileRepository) {}

  async execute(
    customerId: string,
    data: PaymentProfileCreateRequest,
  ): Promise<PaymentProfileResponse> {
    const now = new Date()
    const profile = new PaymentProfile(
      crypto.randomUUID(),
      customerId,
      data.type,
      data.brand,
      data.last4,
      data.holderName,
      data.expirationMonth,
      data.expirationYear,
      data.provider,
      data.externalToken,
      data.isDefault ?? false,
      now,
      now,
      null,
    )

    await this.paymentProfileRepo.create(profile)

    return {
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
    }
  }
}
