import { Payment } from '../../../domain/commerce/payment/payment.entity.js'
import { PaymentTransaction } from '../../../domain/commerce/payment/payment-transaction.entity.js'
import type { PaymentRepository } from '../../../domain/commerce/payment/payment.repository.js'
import type { PaymentTransactionRepository } from '../../../domain/commerce/payment/payment-transaction.repository.js'
import { PaymentProfile } from '../../../domain/commerce/payment/payment-profile.entity.js'
import type { PaymentProfileRepository } from '../../../domain/commerce/payment/payment-profile.repository.js'
import type { OrderRepository } from '../../../domain/commerce/order/order.repository.js'
import type { CustomerRepository } from '../../../domain/commerce/customer/customer.repository.js'
import type { AddressRepository } from '../../../domain/commerce/address/address.repository.js'
import {
  PaymentMethod,
  PaymentProvider,
  PaymentProfileType,
  PaymentStatus,
} from '../../../domain/commerce/shared/enums.js'
import type { PaymentGateway } from './payment-gateway.js'

export type CreatePaymentInput = {
  orderId: string
  method: Payment['method']
  installments: number | null
  paymentProfileId: string | null
  savePaymentProfile?: boolean
  card?: {
    holderName: string
    number: string
    expirationMonth: number
    expirationYear: number
    cvv: string
    brand: string
  }
}

export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly transactionRepo: PaymentTransactionRepository,
    private readonly paymentProfileRepo: PaymentProfileRepository,
    private readonly orderRepo: OrderRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly addressRepo: AddressRepository,
    private readonly gateway: PaymentGateway,
  ) {}

  async createPayment(input: CreatePaymentInput) {
    const order = await this.orderRepo.findById(input.orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    const customer = await this.customerRepo.findById(order.customerId)
    if (!customer) {
      throw new Error('Customer not found')
    }

    const address = await this.addressRepo.findById(order.addressId)
    if (!address) {
      throw new Error('Address not found')
    }

    if (input.savePaymentProfile) {
      if (input.method !== PaymentMethod.CreditCard) {
        throw new Error('Payment profile only supported for credit card')
      }
      if (!input.card) {
        throw new Error('Missing card data to save payment profile')
      }
    }

    const now = new Date()
    const charge = await this.gateway.createCharge({
      orderId: order.id,
      amount: order.totalAmount,
      method: input.method,
      installments: input.installments,
      customer: {
        name: customer.name,
        email: customer.email,
        document: customer.document,
        phone: customer.phone,
      },
      address: {
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
    })

    const payment = new Payment(
      crypto.randomUUID(),
      order.id,
      input.paymentProfileId,
      input.method,
      order.totalAmount,
      input.installments,
      PaymentStatus.Pending,
      now,
      now,
      null,
    )

    if (input.savePaymentProfile && input.card) {
      const tokenResult = await this.gateway.tokenizeCard({
        holderName: input.card.holderName,
        number: input.card.number,
        expirationMonth: input.card.expirationMonth,
        expirationYear: input.card.expirationYear,
        cvv: input.card.cvv,
      })

      const last4 = tokenResult.last4 || input.card.number.slice(-4)
      const brand = tokenResult.brand || input.card.brand

      const profile = new PaymentProfile(
        crypto.randomUUID(),
        customer.id,
        PaymentProfileType.CreditCard,
        brand,
        last4,
        input.card.holderName,
        input.card.expirationMonth,
        input.card.expirationYear,
        PaymentProvider.Asaas,
        tokenResult.token,
        true,
        now,
        now,
        null,
      )

      await this.paymentProfileRepo.create(profile)
    }

    await this.paymentRepo.create(payment)

    const transaction = new PaymentTransaction(
      crypto.randomUUID(),
      payment.id,
      PaymentProvider.Asaas,
      charge.externalId,
      charge.status,
      charge.raw,
      now,
      now,
      null,
    )

    await this.transactionRepo.create(transaction)

    return payment
  }
}
