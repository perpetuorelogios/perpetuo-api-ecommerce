import type { ProductRepository } from '../../../domain/commerce/product/product.repository.js'
import { AppError } from '../../shared/app-error.js'
import type { ProductResponse } from '../../dtos/product.dto.js'

export class GetProductUseCase {
  constructor(private productRepo: ProductRepository) {}

  async execute(id: string): Promise<ProductResponse> {
    const product = await this.productRepo.findById(id)
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      sku: product.sku,
      price: product.price,
      description: product.description,
      isPreorder: product.isPreorder,
      active: product.active,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      deletedAt: product.deletedAt?.toISOString() ?? null,
    }
  }
}
