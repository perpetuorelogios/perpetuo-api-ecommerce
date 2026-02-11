import { OrderStatusHistory } from './order-status-history.entity.js'

export interface OrderStatusHistoryRepository {
  listByOrderId(orderId: string): Promise<OrderStatusHistory[]>
  create(history: OrderStatusHistory): Promise<void>
}
