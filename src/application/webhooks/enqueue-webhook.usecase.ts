import type { PaymentWebhookQueuePort } from './ports/payment-webhook.queue.js'
import { PaymentProvider } from '../../domain/commerce/shared/enums.js'

export class EnqueueWebhookUseCase {
  constructor(private queue: PaymentWebhookQueuePort) {}

  async execute(payload: Record<string, unknown>) {
    await this.queue.add({ provider: PaymentProvider.Asaas, payload })
  }
}
