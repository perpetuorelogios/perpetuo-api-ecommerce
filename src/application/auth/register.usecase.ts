import bcrypt from 'bcrypt'
import { Customer } from '../../domain/commerce/customer/customer.entity.js'
import type { CustomerRepository } from '../../domain/commerce/customer/customer.repository.js'
import type { RegisterRequest, RegisterResponse } from '../dtos/register.dto.js'
import { AppError } from '../shared/app-error.js'
import type { LoggerPort } from '../shared/logger.js'
import { UserRole } from '../../domain/commerce/shared/enums.js'

export class RegisterUseCase {
  constructor(
    private customerRepo: CustomerRepository,
    private logger: LoggerPort,
  ) {}

  async execute(data: RegisterRequest): Promise<RegisterResponse> {
    const existing = await this.customerRepo.findByEmail(data.email)
    if (existing) {
      this.logger.warn('register.email_in_use', { email: data.email })
      throw new AppError('Email already in use', 409)
    }

    const hash = await bcrypt.hash(data.password, 10)
    const now = new Date()
    const customer = new Customer(
      crypto.randomUUID(),
      data.name,
      data.email,
      hash,
      data.document,
      data.phone,
      UserRole.Customer,
      now,
      now,
      null,
    )
    await this.customerRepo.create(customer)

    this.logger.info('register.success', {
      customerId: customer.id,
      email: customer.email,
    })

    return {
      id: customer.id,
      email: customer.email,
      createdAt: customer.createdAt.toISOString(),
    }
  }
}
