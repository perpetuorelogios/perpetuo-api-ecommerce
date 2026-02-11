import { prisma } from '../database/prisma.client.js'
import { Payment } from '../../domain/commerce/payment/payment.entity.js'
import type { PaymentRepository } from '../../domain/commerce/payment/payment.repository.js'

const toDomain = (row: {
  id: string
  orderId: string
  paymentProfileId: string | null
  method: string
  amount: { toNumber(): number }
  installments: number | null
  status: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new Payment(
    row.id,
    row.orderId,
    row.paymentProfileId,
    row.method as Payment['method'],
    row.amount.toNumber(),
    row.installments,
    row.status as Payment['status'],
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaPaymentRepository implements PaymentRepository {
  async findById(id: string) {
    const payment = await prisma.payment.findFirst({
      where: { id, deletedAt: null },
    })
    return payment ? toDomain(payment) : null
  }

  async findByOrderId(orderId: string) {
    const payment = await prisma.payment.findFirst({
      where: { orderId, deletedAt: null },
    })
    return payment ? toDomain(payment) : null
  }

  async create(payment: Payment) {
    await prisma.payment.create({
      data: {
        id: payment.id,
        orderId: payment.orderId,
        paymentProfileId: payment.paymentProfileId,
        method: payment.method,
        amount: payment.amount,
        installments: payment.installments,
        status: payment.status,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        deletedAt: payment.deletedAt,
      },
    })
  }

  async update(payment: Payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentProfileId: payment.paymentProfileId,
        method: payment.method,
        amount: payment.amount,
        installments: payment.installments,
        status: payment.status,
        updatedAt: payment.updatedAt,
        deletedAt: payment.deletedAt,
      },
    })
  }
}
