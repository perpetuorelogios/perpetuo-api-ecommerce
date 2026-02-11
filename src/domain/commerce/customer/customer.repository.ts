import { Customer } from './customer.entity.js'

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>
  findByEmail(email: string): Promise<Customer | null>
  create(customer: Customer): Promise<void>
  update(customer: Customer): Promise<void>
  softDelete(id: string): Promise<void>
}
