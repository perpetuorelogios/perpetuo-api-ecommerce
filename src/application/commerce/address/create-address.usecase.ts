import { Address } from '../../../domain/commerce/address/address.entity.js'
import type { AddressRepository } from '../../../domain/commerce/address/address.repository.js'
import type { AddressCreateRequest, AddressResponse } from '../../dtos/address.dto.js'

export class CreateAddressUseCase {
  constructor(private addressRepo: AddressRepository) {}

  async execute(customerId: string, data: AddressCreateRequest): Promise<AddressResponse> {
    const now = new Date()
    const address = new Address(
      crypto.randomUUID(),
      customerId,
      data.street,
      data.number,
      data.complement ?? null,
      data.city,
      data.state,
      data.zipCode,
      data.isDefault ?? false,
      now,
      now,
      null,
    )

    await this.addressRepo.create(address)

    return {
      id: address.id,
      customerId: address.customerId,
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
      createdAt: address.createdAt.toISOString(),
      updatedAt: address.updatedAt.toISOString(),
      deletedAt: address.deletedAt?.toISOString() ?? null,
    }
  }
}
