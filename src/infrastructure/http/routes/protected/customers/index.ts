import type { FastifyInstance } from 'fastify'
import type { CustomerRepository } from '../../../../../domain/commerce/customer/customer.repository.js'
import {
  CustomerCreateRequestSchema,
  CustomerResponseSchema,
} from '../../../../../application/dtos/customer.dto.js'
import { CreateCustomerUseCase } from '../../../../../application/commerce/customer/create-customer.usecase.js'
import { GetCustomerUseCase } from '../../../../../application/commerce/customer/get-customer.usecase.js'
import { Logger } from '../../../../logging/logger.js'

export function registerCustomerRoutes(
  app: FastifyInstance,
  customerRepo: CustomerRepository,
) {
  app.post('/customers', async (req, reply) => {
    const body = CustomerCreateRequestSchema.parse(req.body)
    const usecase = new CreateCustomerUseCase(customerRepo, new Logger())
    const result = await usecase.execute(body)
    return reply.code(201).send(CustomerResponseSchema.parse(result))
  })

  app.get('/customers/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const usecase = new GetCustomerUseCase(customerRepo, new Logger())
    const result = await usecase.execute(id)
    return reply.code(200).send(CustomerResponseSchema.parse(result))
  })
}
