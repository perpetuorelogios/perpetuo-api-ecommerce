import type { PaymentWebhookQueuePort } from '../../application/webhooks/ports/payment-webhook.queue.js'
import type { PaymentWebhookJob } from '../../application/webhooks/ports/payment-webhook.queue.js'
import { paymentWebhookQueue } from './payment-webhook.queue.js'

export class PaymentWebhookQueueAdapter implements PaymentWebhookQueuePort {
  async add(job: PaymentWebhookJob): Promise<void> {
    await paymentWebhookQueue.add(job.provider, job)
  }
}
