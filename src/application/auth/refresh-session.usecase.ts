import type { CustomerRepository } from '../../domain/commerce/customer/customer.repository.js'
import { AppError } from '../shared/app-error.js'
import type { TokenService } from './ports/token.service.js'
import type { SessionServicePort } from './ports/session.service.js'
import type { LoggerPort } from '../shared/logger.js'

export type RefreshResult = {
  accessToken: string
  sessionId: string
}

export class RefreshSessionUseCase {
  constructor(
    private customerRepo: CustomerRepository,
    private tokenService: TokenService,
    private sessionService: SessionServicePort,
    private logger: LoggerPort,
  ) {}

  async execute(
    sessionId: string,
    context: { ip: string; userAgent: string },
  ): Promise<RefreshResult> {
    const session = await this.sessionService.getSession(sessionId)
    if (!session) {
      this.logger.warn('session.invalid', { sessionId })
      throw new AppError('Invalid session', 401)
    }

    const customer = await this.customerRepo.findById(session.customerId)
    if (!customer) {
      this.logger.warn('session.invalid_customer', {
        sessionId,
        customerId: session.customerId,
      })
      throw new AppError('Invalid session', 401)
    }

    const rotated = await this.sessionService.rotateSession(sessionId, {
      customerId: customer.id,
      ip: context.ip,
      userAgent: context.userAgent,
    })

    const accessToken = this.tokenService.signAccessToken({
      sub: customer.id,
      email: customer.email,
      sid: rotated.sessionId,
    })

    this.logger.info('session.refreshed', {
      customerId: customer.id,
      sessionId: rotated.sessionId,
    })

    return { accessToken, sessionId: rotated.sessionId }
  }
}
