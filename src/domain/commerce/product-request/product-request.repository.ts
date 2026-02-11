import { ProductRequest } from './product-request.entity.js'

export interface ProductRequestRepository {
  findById(id: string): Promise<ProductRequest | null>
  findByPaymentLinkId(paymentLinkId: string): Promise<ProductRequest | null>
  listByCustomerId(customerId: string): Promise<ProductRequest[]>
  create(request: ProductRequest): Promise<void>
  update(request: ProductRequest): Promise<void>
  softDelete(id: string): Promise<void>
}
