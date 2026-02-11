import { OrderItem } from './order-item.entity.js'

export interface OrderItemRepository {
  listByOrderId(orderId: string): Promise<OrderItem[]>
  create(item: OrderItem): Promise<void>
  softDelete(id: string): Promise<void>
}
