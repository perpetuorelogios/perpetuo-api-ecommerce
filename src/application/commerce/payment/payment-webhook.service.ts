import { Payment } from '../../../domain/commerce/payment/payment.entity.js'
import { PaymentTransaction } from '../../../domain/commerce/payment/payment-transaction.entity.js'
import { ProductRequest } from '../../../domain/commerce/product-request/product-request.entity.js'
import { PaymentLink } from '../../../domain/commerce/payment-link/payment-link.entity.js'
import type { PaymentRepository } from '../../../domain/commerce/payment/payment.repository.js'
import type { PaymentTransactionRepository } from '../../../domain/commerce/payment/payment-transaction.repository.js'
import type { OrderRepository } from '../../../domain/commerce/order/order.repository.js'
import type { ProductRequestRepository } from '../../../domain/commerce/product-request/product-request.repository.js'
import type { PaymentLinkRepository } from '../../../domain/commerce/payment-link/payment-link.repository.js'
import {
  PaymentLinkStatus,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  ProductRequestStatus,
} from '../../../domain/commerce/shared/enums.js'

export class PaymentWebhookService {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly transactionRepo: PaymentTransactionRepository,
    private readonly orderRepo: OrderRepository,
    private readonly productRequestRepo: ProductRequestRepository,
    private readonly paymentLinkRepo: PaymentLinkRepository,
  ) {}

  private mapStatus(status: string, event?: string): PaymentStatus {
    const normalizedStatus = status.toLowerCase()
    const normalizedEvent = (event || '').toUpperCase()

    const paidEvents = new Set([
      'PAYMENT_CONFIRMED',
      'PAYMENT_RECEIVED',
      'PAYMENT_DUNNING_RECEIVED',
      'PAYMENT_RECEIVED_IN_CASH_UNDONE',
    ])
    const failedEvents = new Set([
      'PAYMENT_OVERDUE',
      'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED',
      'PAYMENT_REPROVED_BY_RISK_ANALYSIS',
      'PAYMENT_DELETED',
    ])
    const refundedEvents = new Set([
      'PAYMENT_REFUNDED',
      'PAYMENT_PARTIALLY_REFUNDED',
      'PAYMENT_REFUND_IN_PROGRESS',
      'PAYMENT_CHARGEBACK_REQUESTED',
      'PAYMENT_CHARGEBACK_DISPUTE',
      'PAYMENT_AWAITING_CHARGEBACK_REVERSAL',
    ])

    if (paidEvents.has(normalizedEvent)) {
      return PaymentStatus.Paid
    }
    if (refundedEvents.has(normalizedEvent)) {
      return PaymentStatus.Refunded
    }
    if (failedEvents.has(normalizedEvent)) {
      return PaymentStatus.Failed
    }

    if (['paid', 'confirmed', 'received'].includes(normalizedStatus)) {
      return PaymentStatus.Paid
    }
    if (['refunded', 'chargeback', 'refunded_partial'].includes(normalizedStatus)) {
      return PaymentStatus.Refunded
    }
    if (['failed', 'canceled', 'overdue'].includes(normalizedStatus)) {
      return PaymentStatus.Failed
    }
    return PaymentStatus.Pending
  }

  private mapPaymentMethod(input: string): PaymentMethod {
    const normalized = input.toLowerCase()
    if (normalized === 'credit_card') {
      return PaymentMethod.CreditCard
    }
    if (normalized === 'boleto') {
      return PaymentMethod.Boleto
    }
    if (normalized === 'pix') {
      return PaymentMethod.Pix
    }
    if (normalized === 'transfer') {
      return PaymentMethod.Transfer
    }
    return PaymentMethod.Pix
  }

  async handleAsaasWebhook(payload: Record<string, unknown>) {
    const payment = (payload.payment as Record<string, unknown>) || payload
    const externalId = String(payment.id || '')
    const externalReference = String(payment.externalReference || '')
    const status = String(payment.status || '')
    const event = String((payload as Record<string, unknown>).event || '')
    const paymentLinkRaw = payment.paymentLink as
      | string
      | { id?: string }
      | undefined
    const paymentLinkId =
      typeof paymentLinkRaw === 'string'
        ? paymentLinkRaw
        : typeof paymentLinkRaw?.id === 'string'
          ? paymentLinkRaw.id
          : ''

    const mappedStatus = this.mapStatus(status, event)

    if (paymentLinkId) {
      const link = await this.paymentLinkRepo.findByProviderId(paymentLinkId)
      if (link) {
        const now = new Date()
        const updatedLink = new PaymentLink(
          link.id,
          link.provider,
          link.providerId,
          link.url,
          link.name,
          link.description,
          link.value,
          link.billingType,
          link.chargeType,
          link.dueDateLimitDays,
          link.maxInstallmentCount,
          link.subscriptionCycle,
          link.notificationEnabled,
          mappedStatus === PaymentStatus.Paid
            ? PaymentLinkStatus.Paid
            : mappedStatus === PaymentStatus.Failed
              ? PaymentLinkStatus.Failed
              : PaymentLinkStatus.Pending,
          link.createdAt,
          now,
          link.deletedAt,
        )
        await this.paymentLinkRepo.update(updatedLink)

        const request = await this.productRequestRepo.findByPaymentLinkId(
          link.id,
        )
        if (request && !request.deletedAt) {
          if (mappedStatus === PaymentStatus.Paid) {
            const completed = new ProductRequest(
              request.id,
              request.customerId,
              request.productId,
              request.paymentLinkId,
              request.quantity,
              ProductRequestStatus.Completed,
              request.paymentLinkUrl,
              request.notes,
              request.createdAt,
              now,
              now,
            )
            await this.productRequestRepo.update(completed)
          }

          const order = await this.orderRepo.findByProductRequestId(
            request.id,
          )
          if (order) {
            const amount = Number(
              (payment.value as number | undefined) ?? order.totalAmount,
            )
            const safeAmount = Number.isFinite(amount)
              ? amount
              : order.totalAmount
            const method = this.mapPaymentMethod(
              String(payment.billingType || ''),
            )
            const existingPayment = await this.paymentRepo.findByOrderId(
              order.id,
            )

            let paymentId: string

            if (existingPayment) {
              const updatedPayment = new Payment(
                existingPayment.id,
                existingPayment.orderId,
                existingPayment.paymentProfileId,
                method,
                safeAmount,
                existingPayment.installments,
                mappedStatus,
                existingPayment.createdAt,
                now,
                existingPayment.deletedAt,
              )
              await this.paymentRepo.update(updatedPayment)
              paymentId = existingPayment.id
            } else {
              const created = new Payment(
                crypto.randomUUID(),
                order.id,
                null,
                method,
                safeAmount,
                null,
                mappedStatus,
                now,
                now,
                null,
              )
              await this.paymentRepo.create(created)
              paymentId = created.id
            }

            const transaction = new PaymentTransaction(
              crypto.randomUUID(),
              paymentId,
              PaymentProvider.Asaas,
              externalId,
              status,
              payload,
              now,
              now,
              null,
            )
            await this.transactionRepo.create(transaction)
          }
        }
      }
    }

    if (!externalReference) {
      return
    }

    const existing = await this.paymentRepo.findByOrderId(externalReference)
    if (!existing) {
      throw new Error('Payment not found')
    }

    const now = new Date()
    const updated = new Payment(
      existing.id,
      existing.orderId,
      existing.paymentProfileId,
      existing.method,
      existing.amount,
      existing.installments,
      mappedStatus,
      existing.createdAt,
      now,
      existing.deletedAt,
    )

    await this.paymentRepo.update(updated)

    const transaction = new PaymentTransaction(
      crypto.randomUUID(),
      existing.id,
      PaymentProvider.Asaas,
      externalId,
      status,
      payload,
      now,
      now,
      null,
    )

    await this.transactionRepo.create(transaction)

    if (mappedStatus === PaymentStatus.Paid) {
      const order = await this.orderRepo.findById(existing.orderId)
      if (order?.productRequestId) {
        const request = await this.productRequestRepo.findById(
          order.productRequestId,
        )
        if (request && !request.deletedAt) {
          const completed = new ProductRequest(
            request.id,
            request.customerId,
            request.productId,
            request.paymentLinkId,
            request.quantity,
            ProductRequestStatus.Completed,
            request.paymentLinkUrl,
            request.notes,
            request.createdAt,
            now,
            now,
          )
          await this.productRequestRepo.update(completed)
        }
      }
    }
  }
}
