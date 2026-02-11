import { prisma } from '../database/prisma.client.js'
import type { Prisma } from '../../generated/client.js'

export type QueueEventRecord = {
  id: string
  queue: string
  jobId: string
  payload: Record<string, unknown>
  error?: string
  event?: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export class PrismaQueueEventsRepository {
  async recordProcessed(
    queue: string,
    jobId: string,
    event: string,
    payload: Record<string, unknown>,
  ) {
    await prisma.queueProcessedEvent.create({
      data: {
        id: crypto.randomUUID(),
        queue,
        jobId,
        event,
        payload: payload as Prisma.InputJsonValue,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    })
  }

  async recordFailed(
    queue: string,
    jobId: string,
    error: string,
    payload: Record<string, unknown>,
  ) {
    await prisma.queueFailedJob.create({
      data: {
        id: crypto.randomUUID(),
        queue,
        jobId,
        error,
        payload: payload as Prisma.InputJsonValue,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    })
  }
}
