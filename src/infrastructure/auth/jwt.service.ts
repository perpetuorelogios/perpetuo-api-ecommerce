import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../../env.js'

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

export function signAccessToken(payload: object): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  })
}

export function verifyToken(token: string): object {
  return jwt.verify(token, env.JWT_SECRET) as object
}
