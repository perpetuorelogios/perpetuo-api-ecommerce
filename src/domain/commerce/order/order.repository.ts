import { Order } from './order.entity.js'

export interface OrderRepository {
  findById(id: string): Promise<Order | null>
  listByCustomerId(customerId: string): Promise<Order[]>
  findByProductRequestId(productRequestId: string): Promise<Order | null>
  create(order: Order): Promise<void>
  update(order: Order): Promise<void>
  softDelete(id: string): Promise<void>
}
