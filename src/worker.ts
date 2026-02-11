import 'dotenv/config'
import { paymentWebhookWorker } from './infrastructure/queue/payment-webhook.worker.js'

paymentWebhookWorker.on('failed', (job, error) => {
  console.error('Webhook job failed', job?.id, error)
})
