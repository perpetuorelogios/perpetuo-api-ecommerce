import type { PaymentService } from '../../commerce/payment/payment.service.js'
import type { PaymentCreateRequest, PaymentResponse } from '../../dtos/payment.dto.js'
import type { LoggerPort } from '../../shared/logger.js'

export class CreatePaymentUseCase {
  constructor(
    private paymentService: PaymentService,
    private logger: LoggerPort,
  ) {}

  async execute(data: PaymentCreateRequest): Promise<PaymentResponse> {
    const payment = await this.paymentService.createPayment({
      orderId: data.orderId,
      method: data.method,
      installments: data.installments ?? null,
      paymentProfileId: data.paymentProfileId ?? null,
      savePaymentProfile: data.savePaymentProfile ?? false,
      ...(data.card ? { card: data.card } : {}),
    })

    this.logger.info('payment.create.success', {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
    })

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
