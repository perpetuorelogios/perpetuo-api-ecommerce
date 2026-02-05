import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../../env'

export function signToken(
  payload: object,
  options?: SignOptions,
): string {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
      ...options,
    },
  )
}
