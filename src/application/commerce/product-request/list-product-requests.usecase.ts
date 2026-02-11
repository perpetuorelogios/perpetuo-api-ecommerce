import type { ProductRequestRepository } from '../../../domain/commerce/product-request/product-request.repository.js'
import type { ProductRequestResponse } from '../../dtos/product-request.dto.js'

export class ListProductRequestsUseCase {
  constructor(private productRequestRepo: ProductRequestRepository) {}

  async execute(customerId: string): Promise<ProductRequestResponse[]> {
    const requests = await this.productRequestRepo.listByCustomerId(customerId)
    return requests.map((request) => ({
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
    }))
  }
}
