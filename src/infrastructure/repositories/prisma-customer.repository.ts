import { prisma } from '../database/prisma.client.js'
import { Customer } from '../../domain/commerce/customer/customer.entity.js'
import type { CustomerRepository } from '../../domain/commerce/customer/customer.repository.js'

const toDomain = (row: {
  id: string
  name: string
  email: string
  password: string
  document: string
  phone: string
  role: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new Customer(
    row.id,
    row.name,
    row.email,
    row.password,
    row.document,
    row.phone,
    row.role as Customer['role'],
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaCustomerRepository implements CustomerRepository {
  async findById(id: string) {
    const customer = await prisma.customer.findFirst({
      where: { id, deletedAt: null },
    })
    return customer ? toDomain(customer) : null
  }

  async findByEmail(email: string) {
    const customer = await prisma.customer.findFirst({
      where: { email, deletedAt: null },
    })
    return customer ? toDomain(customer) : null
  }

  async create(customer: Customer) {
    await prisma.customer.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password: customer.password,
        document: customer.document,
        phone: customer.phone,
        role: customer.role,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        deletedAt: customer.deletedAt,
      },
    })
  }

  async update(customer: Customer) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: customer.name,
        email: customer.email,
        password: customer.password,
        document: customer.document,
        phone: customer.phone,
        role: customer.role,
        updatedAt: customer.updatedAt,
        deletedAt: customer.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
