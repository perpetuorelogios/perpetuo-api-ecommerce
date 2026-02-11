import { Worker } from 'bullmq'
import { queueConnection } from './queue.connection.js'
import { PaymentWebhookService } from '../../application/commerce/payment/payment-webhook.service.js'
import { PrismaPaymentRepository } from '../repositories/prisma-payment.repository.js'
import { PrismaPaymentTransactionRepository } from '../repositories/prisma-payment-transaction.repository.js'
import { PrismaOrderRepository } from '../repositories/prisma-order.repository.js'
import { PrismaProductRequestRepository } from '../repositories/prisma-product-request.repository.js'
import { PrismaPaymentLinkRepository } from '../repositories/prisma-payment-link.repository.js'
import { PrismaQueueEventsRepository } from '../repositories/prisma-queue-events.repository.js'
import { Logger } from '../logging/logger.js'
import { PaymentProvider } from '../../domain/commerce/shared/enums.js'

const paymentRepo = new PrismaPaymentRepository()
const transactionRepo = new PrismaPaymentTransactionRepository()
const orderRepo = new PrismaOrderRepository()
const productRequestRepo = new PrismaProductRequestRepository()
const paymentLinkRepo = new PrismaPaymentLinkRepository()
const service = new PaymentWebhookService(
  paymentRepo,
  transactionRepo,
  orderRepo,
  productRequestRepo,
  paymentLinkRepo,
)
const queueEventsRepo = new PrismaQueueEventsRepository()
const logger = new Logger()

export const paymentWebhookWorker = new Worker(
  'payment-webhook',
  async (job) => {
    if (job.data.provider === PaymentProvider.Asaas) {
      await service.handleAsaasWebhook(job.data.payload)
    }
  },
  {
    connection: queueConnection,
  },
)

paymentWebhookWorker.on('completed', async (job) => {
  await queueEventsRepo.recordProcessed(
    job.queueName,
    String(job.id),
    'completed',
    job.data as Record<string, unknown>,
  )
  logger.info('queue.job.completed', {
    queue: job.queueName,
    jobId: job.id,
  })
})

paymentWebhookWorker.on('failed', async (job, error) => {
  if (!job) {
    return
  }
  await queueEventsRepo.recordFailed(
    job.queueName,
    String(job.id),
    error.message,
    job.data as Record<string, unknown>,
  )
  logger.error('queue.job.failed', {
    queue: job.queueName,
    jobId: job.id,
    error: error.message,
  })
})
