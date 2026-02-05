import { z } from 'zod'

export const RegisterRequestSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const RegisterResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
