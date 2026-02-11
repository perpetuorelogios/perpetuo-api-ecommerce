import { PaymentProvider } from '../../../domain/commerce/shared/enums.js'

export type PaymentWebhookJob = {
  provider: PaymentProvider
  payload: Record<string, unknown>
}

export interface PaymentWebhookQueuePort {
  add(job: PaymentWebhookJob): Promise<void>
}
