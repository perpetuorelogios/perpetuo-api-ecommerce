import { prisma } from '../database/prisma.client.js'
import { Product } from '../../domain/commerce/product/product.entity.js'
import type { ProductRepository } from '../../domain/commerce/product/product.repository.js'

const toDomain = (row: {
  id: string
  name: string
  brand: string
  model: string
  sku: string
  price: { toNumber(): number }
  description: string | null
  isPreorder: boolean
  active: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new Product(
    row.id,
    row.name,
    row.brand,
    row.model,
    row.sku,
    row.price.toNumber(),
    row.description,
    row.isPreorder,
    row.active,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaProductRepository implements ProductRepository {
  async findById(id: string) {
    const product = await prisma.product.findFirst({
      where: { id, deletedAt: null },
    })
    return product ? toDomain(product) : null
  }

  async findBySku(sku: string) {
    const product = await prisma.product.findFirst({
      where: { sku, deletedAt: null },
    })
    return product ? toDomain(product) : null
  }

  async list() {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
    return products.map(toDomain)
  }

  async create(product: Product) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        model: product.model,
        sku: product.sku,
        price: product.price,
        description: product.description,
        isPreorder: product.isPreorder,
        active: product.active,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
      },
    })
  }

  async update(product: Product) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        brand: product.brand,
        model: product.model,
        sku: product.sku,
        price: product.price,
        description: product.description,
        isPreorder: product.isPreorder,
        active: product.active,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
