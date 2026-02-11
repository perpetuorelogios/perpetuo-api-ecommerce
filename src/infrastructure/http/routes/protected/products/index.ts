import type { FastifyInstance } from 'fastify'
import type { ProductRepository } from '../../../../../domain/commerce/product/product.repository.js'
import type { InventoryRepository } from '../../../../../domain/commerce/inventory/inventory.repository.js'
import type { CacheService } from '../../../../cache/cache.service.js'
import {
  ProductCreateRequestSchema,
  ProductUpdateRequestSchema,
  ProductResponseSchema,
} from '../../../../../application/dtos/product.dto.js'
import { CreateProductUseCase } from '../../../../../application/commerce/product/create-product.usecase.js'
import { ListProductsUseCase } from '../../../../../application/commerce/product/list-products.usecase.js'
import { GetProductUseCase } from '../../../../../application/commerce/product/get-product.usecase.js'
import { UpdateProductUseCase } from '../../../../../application/commerce/product/update-product.usecase.js'
import { DeleteProductUseCase } from '../../../../../application/commerce/product/delete-product.usecase.js'
import { z } from 'zod'
import { Logger } from '../../../../logging/logger.js'
import { requireRoles } from '../../../roles.guard.js'
import { UserRole } from '../../../../../domain/commerce/shared/enums.js'

export function registerProductRoutes(
  app: FastifyInstance,
  productRepo: ProductRepository,
  inventoryRepo: InventoryRepository,
  cache: CacheService,
) {
  app.post(
    '/products',
    { preHandler: requireRoles([UserRole.Admin, UserRole.Seller]) },
    async (req, reply) => {
    const body = ProductCreateRequestSchema.parse(req.body)
    const usecase = new CreateProductUseCase(
      productRepo,
      inventoryRepo,
      cache,
      new Logger(),
    )
    const result = await usecase.execute(body)
    return reply.code(201).send(ProductResponseSchema.parse(result))
    },
  )

  app.get('/products', async (_req, reply) => {
    const usecase = new ListProductsUseCase(productRepo, cache)
    const result = await usecase.execute()
    return reply
      .code(200)
      .send(z.array(ProductResponseSchema).parse(result))
  })

  app.get('/products/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const usecase = new GetProductUseCase(productRepo)
    const result = await usecase.execute(id)
    return reply.code(200).send(ProductResponseSchema.parse(result))
  })

  app.patch(
    '/products/:id',
    { preHandler: requireRoles([UserRole.Admin, UserRole.Seller]) },
    async (req, reply) => {
      const { id } = req.params as { id: string }
      const body = ProductUpdateRequestSchema.parse(req.body)
      const usecase = new UpdateProductUseCase(productRepo, new Logger())
      const result = await usecase.execute(id, body)
      return reply.code(200).send(ProductResponseSchema.parse(result))
    },
  )

  app.delete(
    '/products/:id',
    { preHandler: requireRoles([UserRole.Admin, UserRole.Seller]) },
    async (req, reply) => {
      const { id } = req.params as { id: string }
      const usecase = new DeleteProductUseCase(productRepo, new Logger())
      await usecase.execute(id)
      return reply.code(204).send()
    },
  )
}
