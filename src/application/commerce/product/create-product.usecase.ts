import { Product } from '../../../domain/commerce/product/product.entity.js'
import { Inventory } from '../../../domain/commerce/inventory/inventory.entity.js'
import type { ProductRepository } from '../../../domain/commerce/product/product.repository.js'
import type { InventoryRepository } from '../../../domain/commerce/inventory/inventory.repository.js'
import type { CacheServicePort } from '../../shared/cache.service.js'
import type { ProductCreateRequest, ProductResponse } from '../../dtos/product.dto.js'
import type { LoggerPort } from '../../shared/logger.js'

export class CreateProductUseCase {
  constructor(
    private productRepo: ProductRepository,
    private inventoryRepo: InventoryRepository,
    private cache: CacheServicePort,
    private logger: LoggerPort,
  ) {}

  async execute(data: ProductCreateRequest): Promise<ProductResponse> {
    const now = new Date()
    const product = new Product(
      crypto.randomUUID(),
      data.name,
      data.brand,
      data.model,
      data.sku,
      data.price,
      data.description ?? null,
      data.isPreorder ?? false,
      data.active ?? true,
      now,
      now,
      null,
    )

    await this.productRepo.create(product)

    const inventory = new Inventory(
      crypto.randomUUID(),
      product.id,
      data.quantityAvailable ?? 0,
      0,
      now,
      now,
      null,
    )
    await this.inventoryRepo.create(inventory)

    await this.cache.del('products:list')

    this.logger.info('product.create.success', {
      productId: product.id,
      sku: product.sku,
    })

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
