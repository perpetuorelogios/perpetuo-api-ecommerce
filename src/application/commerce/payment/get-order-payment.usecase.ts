import type { PaymentRepository } from '../../../domain/commerce/payment/payment.repository.js'
import { AppError } from '../../shared/app-error.js'
import type { PaymentResponse } from '../../dtos/payment.dto.js'

export class GetOrderPaymentUseCase {
  constructor(private paymentRepo: PaymentRepository) {}

  async execute(orderId: string): Promise<PaymentResponse> {
    const payment = await this.paymentRepo.findByOrderId(orderId)
    if (!payment) {
      throw new AppError('Payment not found', 404)
    }

    return {
      id: payment.id,
      orderId: payment.orderId,
      paymentProfileId: payment.paymentProfileId,
      method: payment.method,
      amount: payment.amount,
      installments: payment.installments,
      status: payment.status,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      deletedAt: payment.deletedAt?.toISOString() ?? null,
    }
  }
}
