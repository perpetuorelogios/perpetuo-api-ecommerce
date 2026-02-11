import { ProductRequest } from '../../../domain/commerce/product-request/product-request.entity.js'
import type { ProductRequestRepository } from '../../../domain/commerce/product-request/product-request.repository.js'
import type { PaymentLinkRepository } from '../../../domain/commerce/payment-link/payment-link.repository.js'
import { PaymentLink } from '../../../domain/commerce/payment-link/payment-link.entity.js'
import {
  PaymentLinkStatus,
  ProductRequestStatus,
} from '../../../domain/commerce/shared/enums.js'
import type {
  ProductRequestQuote,
  ProductRequestResponse,
} from '../../dtos/product-request.dto.js'
import { AppError } from '../../shared/app-error.js'
import type { LoggerPort } from '../../shared/logger.js'

export class QuoteProductRequestUseCase {
  constructor(
    private productRequestRepo: ProductRequestRepository,
    private paymentLinkRepo: PaymentLinkRepository,
    private logger: LoggerPort,
  ) {}

  async execute(
    id: string,
    data: ProductRequestQuote,
  ): Promise<ProductRequestResponse> {
    const request = await this.productRequestRepo.findById(id)
    if (!request) {
      throw new AppError('Product request not found', 404)
    }

    const now = new Date()
    const updated = new ProductRequest(
      request.id,
      request.customerId,
      request.productId,
      request.paymentLinkId,
      request.quantity,
      ProductRequestStatus.Quoted,
      data.paymentLinkUrl,
      request.notes,
      request.createdAt,
      now,
      request.deletedAt,
    )

    await this.productRequestRepo.update(updated)

    if (request.paymentLinkId) {
      const link = await this.paymentLinkRepo.findById(request.paymentLinkId)
      if (link) {
        const updatedLink = new PaymentLink(
          link.id,
          link.provider,
          link.providerId,
          data.paymentLinkUrl,
          link.name,
          link.description,
          link.value,
          link.billingType,
          link.chargeType,
          link.dueDateLimitDays,
          link.maxInstallmentCount,
          link.subscriptionCycle,
          link.notificationEnabled,
          PaymentLinkStatus.Pending,
          link.createdAt,
          now,
          link.deletedAt,
        )
        await this.paymentLinkRepo.update(updatedLink)
      }
    }

    this.logger.info('product_request.quote.success', {
      requestId: request.id,
      paymentLinkUrl: data.paymentLinkUrl,
    })

    return {
      id: updated.id,
      customerId: updated.customerId,
      productId: updated.productId,
      paymentLinkId: updated.paymentLinkId,
      quantity: updated.quantity,
      status: updated.status,
      paymentLinkUrl: updated.paymentLinkUrl,
      notes: updated.notes,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      deletedAt: updated.deletedAt?.toISOString() ?? null,
    }
  }
}
