import { prisma } from '../database/prisma.client.js'
import { PaymentLink } from '../../domain/commerce/payment-link/payment-link.entity.js'
import type { PaymentLinkRepository } from '../../domain/commerce/payment-link/payment-link.repository.js'

const toDomain = (row: {
  id: string
  provider: string
  providerId: string
  url: string
  name: string
  description: string | null
  value: { toNumber(): number }
  billingType: string
  chargeType: string
  dueDateLimitDays: number | null
  maxInstallmentCount: number | null
  subscriptionCycle: string | null
  notificationEnabled: boolean | null
  status: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new PaymentLink(
    row.id,
    row.provider as PaymentLink['provider'],
    row.providerId,
    row.url,
    row.name,
    row.description,
    row.value.toNumber(),
    row.billingType as PaymentLink['billingType'],
    row.chargeType as PaymentLink['chargeType'],
    row.dueDateLimitDays,
    row.maxInstallmentCount,
    row.subscriptionCycle as PaymentLink['subscriptionCycle'],
    row.notificationEnabled,
    row.status as PaymentLink['status'],
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaPaymentLinkRepository implements PaymentLinkRepository {
  async findById(id: string) {
    const link = await prisma.paymentLink.findFirst({
      where: { id, deletedAt: null },
    })
    return link ? toDomain(link) : null
  }

  async findByProviderId(providerId: string) {
    const link = await prisma.paymentLink.findFirst({
      where: { providerId, deletedAt: null },
    })
    return link ? toDomain(link) : null
  }

  async create(link: PaymentLink) {
    await prisma.paymentLink.create({
      data: {
        id: link.id,
        provider: link.provider,
        providerId: link.providerId,
        url: link.url,
        name: link.name,
        description: link.description,
        value: link.value,
        billingType: link.billingType,
        chargeType: link.chargeType,
        dueDateLimitDays: link.dueDateLimitDays,
        maxInstallmentCount: link.maxInstallmentCount,
        subscriptionCycle: link.subscriptionCycle,
        notificationEnabled: link.notificationEnabled,
        status: link.status,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        deletedAt: link.deletedAt,
      },
    })
  }

  async update(link: PaymentLink) {
    await prisma.paymentLink.update({
      where: { id: link.id },
      data: {
        url: link.url,
        name: link.name,
        description: link.description,
        value: link.value,
        billingType: link.billingType,
        chargeType: link.chargeType,
        dueDateLimitDays: link.dueDateLimitDays,
        maxInstallmentCount: link.maxInstallmentCount,
        subscriptionCycle: link.subscriptionCycle,
        notificationEnabled: link.notificationEnabled,
        status: link.status,
        updatedAt: link.updatedAt,
        deletedAt: link.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.paymentLink.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
