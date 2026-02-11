export interface LoginAttemptsServicePort {
  isLocked(email: string, ip: string): Promise<boolean>
  recordFailed(email: string, ip: string): Promise<number>
  reset(email: string, ip: string): Promise<void>
}
