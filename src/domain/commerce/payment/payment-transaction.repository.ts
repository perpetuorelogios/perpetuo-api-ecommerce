import { PaymentTransaction } from './payment-transaction.entity.js'

export interface PaymentTransactionRepository {
  listByPaymentId(paymentId: string): Promise<PaymentTransaction[]>
  create(transaction: PaymentTransaction): Promise<void>
}
