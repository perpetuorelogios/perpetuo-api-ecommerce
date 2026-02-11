import { prisma } from '../database/prisma.client.js'
import { PaymentProfile } from '../../domain/commerce/payment/payment-profile.entity.js'
import type { PaymentProfileRepository } from '../../domain/commerce/payment/payment-profile.repository.js'

const toDomain = (row: {
  id: string
  customerId: string
  type: string
  brand: string
  last4: string
  holderName: string
  expirationMonth: number
  expirationYear: number
  provider: string
  externalToken: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}) =>
  new PaymentProfile(
    row.id,
    row.customerId,
    row.type as PaymentProfile['type'],
    row.brand,
    row.last4,
    row.holderName,
    row.expirationMonth,
    row.expirationYear,
    row.provider as PaymentProfile['provider'],
    row.externalToken,
    row.isDefault,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )

export class PrismaPaymentProfileRepository
  implements PaymentProfileRepository
{
  async findById(id: string) {
    const profile = await prisma.paymentProfile.findFirst({
      where: { id, deletedAt: null },
    })
    return profile ? toDomain(profile) : null
  }

  async listByCustomerId(customerId: string) {
    const profiles = await prisma.paymentProfile.findMany({
      where: { customerId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    })
    return profiles.map(toDomain)
  }

  async create(profile: PaymentProfile) {
    await prisma.paymentProfile.create({
      data: {
        id: profile.id,
        customerId: profile.customerId,
        type: profile.type,
        brand: profile.brand,
        last4: profile.last4,
        holderName: profile.holderName,
        expirationMonth: profile.expirationMonth,
        expirationYear: profile.expirationYear,
        provider: profile.provider,
        externalToken: profile.externalToken,
        isDefault: profile.isDefault,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        deletedAt: profile.deletedAt,
      },
    })
  }

  async update(profile: PaymentProfile) {
    await prisma.paymentProfile.update({
      where: { id: profile.id },
      data: {
        type: profile.type,
        brand: profile.brand,
        last4: profile.last4,
        holderName: profile.holderName,
        expirationMonth: profile.expirationMonth,
        expirationYear: profile.expirationYear,
        provider: profile.provider,
        externalToken: profile.externalToken,
        isDefault: profile.isDefault,
        updatedAt: profile.updatedAt,
        deletedAt: profile.deletedAt,
      },
    })
  }

  async softDelete(id: string) {
    await prisma.paymentProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
