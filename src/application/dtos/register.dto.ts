import { z } from 'zod'

export const RegisterRequestSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  document: z.string().min(5, 'Documento obrigatório'),
  phone: z.string().min(5, 'Telefone obrigatório'),
})

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const RegisterResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
