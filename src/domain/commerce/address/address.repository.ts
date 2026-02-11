import { Address } from './address.entity.js'

export interface AddressRepository {
  findById(id: string): Promise<Address | null>
  listByCustomerId(customerId: string): Promise<Address[]>
  create(address: Address): Promise<void>
  update(address: Address): Promise<void>
  softDelete(id: string): Promise<void>
}
