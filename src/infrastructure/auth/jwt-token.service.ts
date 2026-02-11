import type { TokenService } from '../../application/auth/ports/token.service.js'
import { signAccessToken } from './jwt.service.js'

export class JwtTokenService implements TokenService {
  signAccessToken(payload: object): string {
    return signAccessToken(payload)
  }
}
