import type { CustomerRepository } from '../../../domain/commerce/customer/customer.repository.js'
import { AppError } from '../../shared/app-error.js'
import type { CustomerResponse } from '../../dtos/customer.dto.js'
import type { LoggerPort } from '../../shared/logger.js'

export class GetCustomerUseCase {
  constructor(
    private customerRepo: CustomerRepository,
    private logger: LoggerPort,
  ) {}

  async execute(id: string): Promise<CustomerResponse> {
    const customer = await this.customerRepo.findById(id)
    if (!customer) {
      this.logger.warn('customer.get.not_found', { customerId: id })
      throw new AppError('Customer not found', 404)
    }

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      document: customer.document,
      phone: customer.phone,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      deletedAt: customer.deletedAt?.toISOString() ?? null,
    }
  }
}
