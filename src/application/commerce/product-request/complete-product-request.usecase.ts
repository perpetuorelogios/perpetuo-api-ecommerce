import { ProductRequest } from '../../../domain/commerce/product-request/product-request.entity.js'
import type { ProductRequestRepository } from '../../../domain/commerce/product-request/product-request.repository.js'
import { ProductRequestStatus } from '../../../domain/commerce/shared/enums.js'
import { AppError } from '../../shared/app-error.js'
import type { LoggerPort } from '../../shared/logger.js'

export class CompleteProductRequestUseCase {
  constructor(
    private productRequestRepo: ProductRequestRepository,
    private logger: LoggerPort,
  ) {}

  async execute(id: string): Promise<void> {
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
      ProductRequestStatus.Completed,
      request.paymentLinkUrl,
      request.notes,
      request.createdAt,
      now,
      now,
    )

    await this.productRequestRepo.update(updated)

    this.logger.info('product_request.complete.success', {
      requestId: request.id,
    })
  }
}
