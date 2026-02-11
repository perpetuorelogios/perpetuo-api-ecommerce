import type { FastifyInstance } from 'fastify'
import type { AddressRepository } from '../../../../../domain/commerce/address/address.repository.js'
import {
  AddressCreateRequestSchema,
  AddressResponseSchema,
} from '../../../../../application/dtos/address.dto.js'
import { CreateAddressUseCase } from '../../../../../application/commerce/address/create-address.usecase.js'
import { ListAddressesUseCase } from '../../../../../application/commerce/address/list-addresses.usecase.js'
import { z } from 'zod'

export function registerAddressRoutes(
  app: FastifyInstance,
  addressRepo: AddressRepository,
) {
  app.post('/customers/:customerId/addresses', async (req, reply) => {
    const { customerId } = req.params as { customerId: string }
    const body = AddressCreateRequestSchema.parse(req.body)
    const usecase = new CreateAddressUseCase(addressRepo)
    const result = await usecase.execute(customerId, body)
    return reply.code(201).send(AddressResponseSchema.parse(result))
  })

  app.get('/customers/:customerId/addresses', async (req, reply) => {
    const { customerId } = req.params as { customerId: string }
    const usecase = new ListAddressesUseCase(addressRepo)
    const result = await usecase.execute(customerId)
    return reply
      .code(200)
      .send(z.array(AddressResponseSchema).parse(result))
  })
}
