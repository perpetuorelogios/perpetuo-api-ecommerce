import { Product } from '../../../domain/commerce/product/product.entity.js'
import type { ProductRepository } from '../../../domain/commerce/product/product.repository.js'
import type { ProductUpdateRequest, ProductResponse } from '../../dtos/product.dto.js'
import { AppError } from '../../shared/app-error.js'
import type { LoggerPort } from '../../shared/logger.js'

export class UpdateProductUseCase {
  constructor(
    private productRepo: ProductRepository,
    private logger: LoggerPort,
  ) {}

  async execute(id: string, data: ProductUpdateRequest): Promise<ProductResponse> {
    const product = await this.productRepo.findById(id)
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const updated = new Product(
      product.id,
      data.name ?? product.name,
      data.brand ?? product.brand,
      data.model ?? product.model,
      data.sku ?? product.sku,
      data.price ?? product.price,
      data.description ?? product.description,
      data.isPreorder ?? product.isPreorder,
      data.active ?? product.active,
      product.createdAt,
      new Date(),
      product.deletedAt,
    )

    await this.productRepo.update(updated)

    this.logger.info('product.update.success', {
      productId: updated.id,
      sku: updated.sku,
    })

    return {
      id: updated.id,
      name: updated.name,
      brand: updated.brand,
      model: updated.model,
      sku: updated.sku,
      price: updated.price,
      description: updated.description,
      isPreorder: updated.isPreorder,
      active: updated.active,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      deletedAt: updated.deletedAt?.toISOString() ?? null,
    }
  }
}
