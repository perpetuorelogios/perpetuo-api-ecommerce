import { Queue } from 'bullmq'
import { queueConnection } from './queue.connection.js'
import { PaymentProvider } from '../../domain/commerce/shared/enums.js'

export type PaymentWebhookJob = {
  provider: PaymentProvider
  payload: Record<string, unknown>
}

export const paymentWebhookQueue = new Queue<PaymentWebhookJob>(
  'payment-webhook',
  {
    connection: queueConnection,
  },
)
