import { Product } from './product.entity.js'

export interface ProductRepository {
  findById(id: string): Promise<Product | null>
  findBySku(sku: string): Promise<Product | null>
  list(): Promise<Product[]>
  create(product: Product): Promise<void>
  update(product: Product): Promise<void>
  softDelete(id: string): Promise<void>
}
