import type { ProductRepository } from '../../../domain/commerce/product/product.repository.js'
import type { CacheServicePort } from '../../shared/cache.service.js'
import type { ProductResponse } from '../../dtos/product.dto.js'

export class ListProductsUseCase {
  constructor(
    private productRepo: ProductRepository,
    private cache: CacheServicePort,
  ) {}

  async execute(): Promise<ProductResponse[]> {
    const cached = await this.cache.getJson<ProductResponse[]>('products:list')
    if (cached) {
      return cached
    }

    const products = await this.productRepo.list()
    const response = products.map((product) => ({
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
    }))

    await this.cache.setJson('products:list', response, 60)
    return response
  }
}
