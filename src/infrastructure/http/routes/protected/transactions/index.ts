import type { FastifyInstance } from 'fastify'
import type { PaymentTransactionRepository } from '../../../../../domain/commerce/payment/payment-transaction.repository.js'
import { PaymentTransactionResponseSchema } from '../../../../../application/dtos/payment-transaction.dto.js'
import { ListPaymentTransactionsUseCase } from '../../../../../application/commerce/payment/list-transactions.usecase.js'
import { z } from 'zod'

export function registerTransactionRoutes(
  app: FastifyInstance,
  transactionRepo: PaymentTransactionRepository,
) {
  app.get('/payments/:paymentId/transactions', async (req, reply) => {
    const { paymentId } = req.params as { paymentId: string }
    const usecase = new ListPaymentTransactionsUseCase(transactionRepo)
    const result = await usecase.execute(paymentId)
    return reply
      .code(200)
      .send(z.array(PaymentTransactionResponseSchema).parse(result))
  })
}
