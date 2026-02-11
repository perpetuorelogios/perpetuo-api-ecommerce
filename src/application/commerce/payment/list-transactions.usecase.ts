import type { PaymentTransactionRepository } from '../../../domain/commerce/payment/payment-transaction.repository.js'
import type { PaymentTransactionResponse } from '../../dtos/payment-transaction.dto.js'

export class ListPaymentTransactionsUseCase {
  constructor(private transactionRepo: PaymentTransactionRepository) {}

  async execute(paymentId: string): Promise<PaymentTransactionResponse[]> {
    const transactions = await this.transactionRepo.listByPaymentId(paymentId)
    return transactions.map((transaction) => ({
      id: transaction.id,
      paymentId: transaction.paymentId,
      provider: transaction.provider,
      externalId: transaction.externalId,
      status: transaction.status,
      payload: transaction.payload,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      deletedAt: transaction.deletedAt?.toISOString() ?? null,
    }))
  }
}
