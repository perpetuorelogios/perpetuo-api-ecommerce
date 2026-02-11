import { prisma } from '../database/prisma.client.js'
import { Address } from '../../domain/commerce/address/address.entity.js'
import type { AddressRepository } from '../../domain/commerce/address/address.repository.js'

const toDomain = (row: {
  id: string
  customerId: string
  street: string
  number: string
  complement: string | null
  city: string
  state: string
  zipCode: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new Address(
    row.id,
    row.customerId,
    row.street,
    row.number,
    row.complement,
    row.city,
    row.state,
    row.zipCode,
    row.isDefault,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaAddressRepository implements AddressRepository {
  async findById(id: string) {
    const address = await prisma.address.findFirst({
      where: { id, deletedAt: null },
    })
    return address ? toDomain(address) : null
  }

  async listByCustomerId(customerId: string) {
    const addresses = await prisma.address.findMany({
      where: { customerId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    })
    return addresses.map(toDomain)
  }

  async create(address: Address) {
    await prisma.address.create({
      data: {
        id: address.id,
        customerId: address.customerId,
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
        deletedAt: address.deletedAt,
      },
    })
  }

  async update(address: Address) {
    await prisma.address.update({
      where: { id: address.id },
      data: {
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
        updatedAt: address.updatedAt,
        deletedAt: address.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.address.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
