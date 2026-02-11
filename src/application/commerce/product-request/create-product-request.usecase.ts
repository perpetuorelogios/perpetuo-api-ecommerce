import { ProductRequest } from '../../../domain/commerce/product-request/product-request.entity.js'
import type { ProductRequestRepository } from '../../../domain/commerce/product-request/product-request.repository.js'
import type { ProductRepository } from '../../../domain/commerce/product/product.repository.js'
import { PaymentLink } from '../../../domain/commerce/payment-link/payment-link.entity.js'
import type { PaymentLinkRepository } from '../../../domain/commerce/payment-link/payment-link.repository.js'
import {
  PaymentLinkBillingType,
  PaymentLinkChargeType,
  PaymentLinkStatus,
  PaymentProvider,
  ProductRequestStatus,
} from '../../../domain/commerce/shared/enums.js'
import type {
  ProductRequestCreate,
  ProductRequestResponse,
} from '../../dtos/product-request.dto.js'
import { AppError } from '../../shared/app-error.js'
import type { LoggerPort } from '../../shared/logger.js'
import type { PaymentGateway } from '../payment/payment-gateway.js'

export class CreateProductRequestUseCase {
  constructor(
    private productRequestRepo: ProductRequestRepository,
    private productRepo: ProductRepository,
    private paymentLinkRepo: PaymentLinkRepository,
    private paymentGateway: PaymentGateway,
    private logger: LoggerPort,
  ) {}

  async execute(data: ProductRequestCreate): Promise<ProductRequestResponse> {
    const product = await this.productRepo.findById(data.productId)
    if (!product) {
      this.logger.warn('product_request.create.product_not_found', {
        productId: data.productId,
      })
      throw new AppError('Product not found', 404)
    }

    const now = new Date()
    const value = product.price * data.quantity
    const linkResult = await this.paymentGateway.createPaymentLink({
      name: `Sob encomenda: ${product.name}`,
      description: product.description ?? product.name,
      value,
      billingType: PaymentLinkBillingType.Undefined,
      chargeType: PaymentLinkChargeType.Detached,
      dueDateLimitDays: 10,
      notificationEnabled: true,
    })

    const link = new PaymentLink(
      crypto.randomUUID(),
      PaymentProvider.Asaas,
      linkResult.id,
      linkResult.url,
      `Sob encomenda: ${product.name}`,
      product.description ?? product.name,
      value,
      PaymentLinkBillingType.Undefined,
      PaymentLinkChargeType.Detached,
      10,
      null,
      null,
      true,
      PaymentLinkStatus.Pending,
      now,
      now,
      null,
    )

    await this.paymentLinkRepo.create(link)

    const request = new ProductRequest(
      crypto.randomUUID(),
      data.customerId,
      data.productId,
      link.id,
      data.quantity,
      ProductRequestStatus.Quoted,
      link.url,
      data.notes ?? null,
      now,
      now,
      null,
    )

    await this.productRequestRepo.create(request)

    this.logger.info('product_request.create.success', {
      requestId: request.id,
      customerId: request.customerId,
      productId: request.productId,
    })

    return {
      id: request.id,
      customerId: request.customerId,
      productId: request.productId,
      paymentLinkId: request.paymentLinkId,
      quantity: request.quantity,
      status: request.status,
      paymentLinkUrl: request.paymentLinkUrl,
      notes: request.notes,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      deletedAt: request.deletedAt?.toISOString() ?? null,
    }
  }
}
