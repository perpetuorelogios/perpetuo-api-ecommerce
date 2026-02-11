import bcrypt from 'bcrypt'
import { Customer } from '../../../domain/commerce/customer/customer.entity.js'
import type { CustomerRepository } from '../../../domain/commerce/customer/customer.repository.js'
import type { CustomerCreateRequest, CustomerResponse } from '../../dtos/customer.dto.js'
import { AppError } from '../../shared/app-error.js'
import type { LoggerPort } from '../../shared/logger.js'

export class CreateCustomerUseCase {
  constructor(
    private customerRepo: CustomerRepository,
    private logger: LoggerPort,
  ) {}

  async execute(data: CustomerCreateRequest): Promise<CustomerResponse> {
    const existing = await this.customerRepo.findByEmail(data.email)
    if (existing) {
      this.logger.warn('customer.create.email_in_use', { email: data.email })
      throw new AppError('Email already in use', 409)
    }

    const now = new Date()
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const customer = new Customer(
      crypto.randomUUID(),
      data.name,
      data.email,
      hashedPassword,
      data.document,
      data.phone,
      now,
      now,
      null,
    )

    await this.customerRepo.create(customer)

    this.logger.info('customer.create.success', {
      customerId: customer.id,
      email: customer.email,
    })

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
