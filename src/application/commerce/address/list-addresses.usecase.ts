import type { AddressRepository } from '../../../domain/commerce/address/address.repository.js'
import type { AddressResponse } from '../../dtos/address.dto.js'

export class ListAddressesUseCase {
  constructor(private addressRepo: AddressRepository) {}

  async execute(customerId: string): Promise<AddressResponse[]> {
    const addresses = await this.addressRepo.listByCustomerId(customerId)
    return addresses.map((address) => ({
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
    }))
  }
}
