import { PaymentMethod } from '../../../domain/commerce/shared/enums.js'

export type PaymentCustomer = {
  name: string
  email: string
  document: string
  phone: string
}

export type PaymentAddress = {
  street: string
  number: string
  complement: string | null
  city: string
  state: string
  zipCode: string
}

export type CreateChargeInput = {
  orderId: string
  amount: number
  method: PaymentMethod
  installments: number | null
  customer: PaymentCustomer
  address: PaymentAddress
}

export type CreateChargeResult = {
  externalId: string
  status: string
  raw: Record<string, unknown>
}

export type TokenizeCardInput = {
  holderName: string
  number: string
  expirationMonth: number
  expirationYear: number
  cvv: string
}

export type TokenizeCardResult = {
  token: string
  brand?: string
  last4?: string
}

export type CreatePaymentLinkInput = {
  name: string
  description?: string
  value: number
  billingType: string
  chargeType: string
  dueDateLimitDays?: number
  maxInstallmentCount?: number
  subscriptionCycle?: string
  notificationEnabled?: boolean
}

export type CreatePaymentLinkResult = {
  id: string
  url: string
}

export interface PaymentGateway {
  createCharge(input: CreateChargeInput): Promise<CreateChargeResult>
  tokenizeCard(input: TokenizeCardInput): Promise<TokenizeCardResult>
  createPaymentLink(
    input: CreatePaymentLinkInput,
  ): Promise<CreatePaymentLinkResult>
}
