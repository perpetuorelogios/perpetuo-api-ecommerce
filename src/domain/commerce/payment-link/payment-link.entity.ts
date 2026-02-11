import { BaseEntity } from '../shared/base.entity.js'
import {
  PaymentLinkBillingType,
  PaymentLinkChargeType,
  PaymentLinkStatus,
  PaymentLinkSubscriptionCycle,
  PaymentProvider,
} from '../shared/enums.js'

export class PaymentLink extends BaseEntity {
  constructor(
    id: string,
    public readonly provider: PaymentProvider,
    public readonly providerId: string,
    public readonly url: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly value: number,
    public readonly billingType: PaymentLinkBillingType,
    public readonly chargeType: PaymentLinkChargeType,
    public readonly dueDateLimitDays: number | null,
    public readonly maxInstallmentCount: number | null,
    public readonly subscriptionCycle: PaymentLinkSubscriptionCycle | null,
    public readonly notificationEnabled: boolean | null,
    public readonly status: PaymentLinkStatus,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
