import type { SessionServicePort } from './ports/session.service.js'
import type { LoggerPort } from '../shared/logger.js'

export class LogoutUseCase {
  constructor(
    private sessionService: SessionServicePort,
    private logger: LoggerPort,
  ) {}

  async execute(sessionId: string) {
    await this.sessionService.revokeSession(sessionId)
    this.logger.info('session.revoked', { sessionId })
  }
}
