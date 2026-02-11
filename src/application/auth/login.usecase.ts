import type { CustomerRepository } from '../../domain/commerce/customer/customer.repository.js'
import type { LoginRequest } from '../dtos/login.dto.js'
import { AppError } from '../shared/app-error.js'
import type { TokenService } from './ports/token.service.js'
import type { SessionServicePort } from './ports/session.service.js'
import type { LoginAttemptsServicePort } from './ports/login-attempts.service.js'
import bcrypt from 'bcrypt'
import type { LoggerPort } from '../shared/logger.js'

export type LoginResult = {
  accessToken: string
  sessionId: string
}

export class LoginUseCase {
  constructor(
    private customerRepo: CustomerRepository,
    private tokenService: TokenService,
    private sessionService: SessionServicePort,
    private attemptsService: LoginAttemptsServicePort,
    private logger: LoggerPort,
  ) {}

  async execute(
    data: LoginRequest,
    context: { ip: string; userAgent: string },
  ): Promise<LoginResult> {
    if (await this.attemptsService.isLocked(data.email, context.ip)) {
      this.logger.warn('login.locked', { email: data.email, ip: context.ip })
      throw new AppError('Too many attempts', 429)
    }

    const customer = await this.customerRepo.findByEmail(data.email)
    if (!customer) {
      await this.attemptsService.recordFailed(data.email, context.ip)
      this.logger.warn('login.invalid_email', {
        email: data.email,
        ip: context.ip,
      })
      throw new AppError('Invalid credentials', 401)
    }

    const isValid = await bcrypt.compare(data.password, customer.password)
    if (!isValid) {
      await this.attemptsService.recordFailed(data.email, context.ip)
      this.logger.warn('login.invalid_password', {
        customerId: customer.id,
        ip: context.ip,
      })
      throw new AppError('Invalid credentials', 401)
    }

    await this.attemptsService.reset(data.email, context.ip)

    const session = await this.sessionService.createSession({
      customerId: customer.id,
      ip: context.ip,
      userAgent: context.userAgent,
    })

    const accessToken = this.tokenService.signAccessToken({
      sub: customer.id,
      email: customer.email,
      sid: session.sessionId,
      role: customer.role,
    })

    this.logger.info('login.success', {
      customerId: customer.id,
      sessionId: session.sessionId,
    })

    return { accessToken, sessionId: session.sessionId }
  }
}
