export type SessionData = {
  customerId: string
  ip: string
  userAgent: string
}

export interface SessionServicePort {
  createSession(data: SessionData): Promise<{ sessionId: string }>
  getSession(sessionId: string): Promise<SessionData | null>
  rotateSession(
    sessionId: string,
    data: SessionData,
  ): Promise<{ sessionId: string }>
  revokeSession(sessionId: string): Promise<void>
}
