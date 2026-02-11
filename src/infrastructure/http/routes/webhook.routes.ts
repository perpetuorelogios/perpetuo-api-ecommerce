import type { FastifyInstance } from 'fastify'
import { env } from '../../../env.js'
import { WebhookPayloadSchema } from '../../../application/dtos/webhook.dto.js'
import { PaymentWebhookQueueAdapter } from '../../queue/payment-webhook.queue-adapter.js'
import { HandleAsaasWebhookUseCase } from '../../../application/webhooks/handle-asaas-webhook.usecase.js'
import { Logger } from '../../logging/logger.js'

export async function registerWebhookRoutes(app: FastifyInstance) {
  const queue = new PaymentWebhookQueueAdapter()
  const logger = new Logger()
  const usecase = new HandleAsaasWebhookUseCase(
    queue,
    env.ASAAS_WEBHOOK_TOKEN,
    logger,
  )

  app.post('/webhooks/asaas', async (req, reply) => {
    const token = req.headers['asaas-access-token'] as string | undefined
    const payload = WebhookPayloadSchema.parse(req.body)

    await usecase.execute(token, payload)
    return reply.code(202).send({ status: 'accepted' })
  })
}
