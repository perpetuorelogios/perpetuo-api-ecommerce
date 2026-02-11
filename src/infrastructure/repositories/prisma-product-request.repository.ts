import { prisma } from '../database/prisma.client.js'
import { ProductRequest } from '../../domain/commerce/product-request/product-request.entity.js'
import type { ProductRequestRepository } from '../../domain/commerce/product-request/product-request.repository.js'

const toDomain = (row: {
  id: string
  customerId: string
  productId: string
  paymentLinkId: string | null
  quantity: number
  status: string
  paymentLinkUrl: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new ProductRequest(
    row.id,
    row.customerId,
    row.productId,
    row.paymentLinkId,
    row.quantity,
    row.status as ProductRequest['status'],
    row.paymentLinkUrl,
    row.notes,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaProductRequestRepository
  implements ProductRequestRepository
{
  async findById(id: string) {
    const request = await prisma.productRequest.findFirst({
      where: { id, deletedAt: null },
    })
    return request ? toDomain(request) : null
  }

  async findByPaymentLinkId(paymentLinkId: string) {
    const request = await prisma.productRequest.findFirst({
      where: { paymentLinkId, deletedAt: null },
    })
    return request ? toDomain(request) : null
  }

  async listByCustomerId(customerId: string) {
    const requests = await prisma.productRequest.findMany({
      where: { customerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
    return requests.map(toDomain)
  }

  async create(request: ProductRequest) {
    await prisma.productRequest.create({
      data: {
        id: request.id,
        customerId: request.customerId,
        productId: request.productId,
        paymentLinkId: request.paymentLinkId,
        quantity: request.quantity,
        status: request.status,
        paymentLinkUrl: request.paymentLinkUrl,
        notes: request.notes,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        deletedAt: request.deletedAt,
      },
    })
  }

  async update(request: ProductRequest) {
    await prisma.productRequest.update({
      where: { id: request.id },
      data: {
        quantity: request.quantity,
        status: request.status,
        paymentLinkId: request.paymentLinkId,
        paymentLinkUrl: request.paymentLinkUrl,
        notes: request.notes,
        updatedAt: request.updatedAt,
        deletedAt: request.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.productRequest.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
