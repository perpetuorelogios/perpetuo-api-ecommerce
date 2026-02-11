import { BaseEntity } from '../shared/base.entity.js'
import { PaymentProfileType, PaymentProvider } from '../shared/enums.js'

export class PaymentProfile extends BaseEntity {
  constructor(
    id: string,
    public readonly customerId: string,
    public readonly type: PaymentProfileType,
    public readonly brand: string,
    public readonly last4: string,
    public readonly holderName: string,
    public readonly expirationMonth: number,
    public readonly expirationYear: number,
    public readonly provider: PaymentProvider,
    public readonly externalToken: string,
    public readonly isDefault: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
  }
}
