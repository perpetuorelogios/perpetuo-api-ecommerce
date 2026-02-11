import { AppError } from '../shared/app-error.js'
import { PaymentProvider } from '../../domain/commerce/shared/enums.js'
import type { PaymentWebhookQueuePort } from './ports/payment-webhook.queue.js'
import type { LoggerPort } from '../shared/logger.js'

export class HandleAsaasWebhookUseCase {
  constructor(
    private queue: PaymentWebhookQueuePort,
    private expectedToken: string,
    private logger: LoggerPort,
  ) {}

  async execute(token: string | undefined, payload: Record<string, unknown>) {
    if (token !== this.expectedToken) {
      this.logger.warn('webhook.invalid_token')
      throw new AppError('Invalid webhook token', 401)
    }

    await this.queue.add({ provider: PaymentProvider.Asaas, payload })
    this.logger.info('webhook.enqueued')
  }
}
