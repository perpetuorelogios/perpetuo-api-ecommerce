import type { ProductRepository } from '../../../domain/commerce/product/product.repository.js'
import { AppError } from '../../shared/app-error.js'
import type { LoggerPort } from '../../shared/logger.js'

export class DeleteProductUseCase {
  constructor(
    private productRepo: ProductRepository,
    private logger: LoggerPort,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepo.findById(id)
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    await this.productRepo.softDelete(id)

    this.logger.info('product.delete.success', { productId: id })
  }
}
