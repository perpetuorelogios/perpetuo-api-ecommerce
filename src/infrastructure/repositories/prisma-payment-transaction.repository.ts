import { prisma } from '../database/prisma.client.js'
import { Prisma } from '../../generated/client.js'
import { PaymentTransaction } from '../../domain/commerce/payment/payment-transaction.entity.js'
import type { PaymentTransactionRepository } from '../../domain/commerce/payment/payment-transaction.repository.js'
import type { PaymentProvider } from '../../domain/commerce/shared/enums.js'

const toDomain = (row: {
  id: string
  paymentId: string
  provider: string
  externalId: string
  status: string
  payload: unknown
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new PaymentTransaction(
    row.id,
    row.paymentId,
    row.provider as PaymentProvider,
    row.externalId,
    row.status,
    row.payload as Record<string, unknown>,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaPaymentTransactionRepository
  implements PaymentTransactionRepository
{
  async listByPaymentId(paymentId: string) {
    const transactions = await prisma.paymentTransaction.findMany({
      where: { paymentId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    })
    return transactions.map(toDomain)
  }

  async create(transaction: PaymentTransaction) {
    await prisma.paymentTransaction.create({
      data: {
        id: transaction.id,
        paymentId: transaction.paymentId,
        provider: transaction.provider,
        externalId: transaction.externalId,
        status: transaction.status,
        payload: transaction.payload as Prisma.InputJsonValue,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        deletedAt: transaction.deletedAt,
      },
    })
  }
}
