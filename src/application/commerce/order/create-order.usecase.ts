import { Order } from '../../../domain/commerce/order/order.entity.js'
import { OrderItem } from '../../../domain/commerce/order/order-item.entity.js'
import { OrderStatusHistory } from '../../../domain/commerce/order/order-status-history.entity.js'
import type { OrderRepository } from '../../../domain/commerce/order/order.repository.js'
import type { OrderItemRepository } from '../../../domain/commerce/order/order-item.repository.js'
import type { OrderStatusHistoryRepository } from '../../../domain/commerce/order/order-status-history.repository.js'
import type { ProductRepository } from '../../../domain/commerce/product/product.repository.js'
import type { InventoryRepository } from '../../../domain/commerce/inventory/inventory.repository.js'
import type { InventoryMovementRepository } from '../../../domain/commerce/inventory/inventory-movement.repository.js'
import type { CouponRepository } from '../../../domain/commerce/coupon/coupon.repository.js'
import type { ProductRequestRepository } from '../../../domain/commerce/product-request/product-request.repository.js'
import { Inventory } from '../../../domain/commerce/inventory/inventory.entity.js'
import { InventoryMovement } from '../../../domain/commerce/inventory/inventory-movement.entity.js'
import {
  CouponType,
  InventoryMovementReferenceType,
  InventoryMovementType,
  OrderStatus,
  OrderStatusChangedBy,
  ProductRequestStatus,
} from '../../../domain/commerce/shared/enums.js'
import type { OrderCreateRequest, OrderResponse } from '../../dtos/order.dto.js'
import { AppError } from '../../shared/app-error.js'
import type { LoggerPort } from '../../shared/logger.js'

export class CreateOrderUseCase {
  constructor(
    private orderRepo: OrderRepository,
    private orderItemRepo: OrderItemRepository,
    private productRepo: ProductRepository,
    private inventoryRepo: InventoryRepository,
    private inventoryMovementRepo: InventoryMovementRepository,
    private couponRepo: CouponRepository,
    private productRequestRepo: ProductRequestRepository,
    private orderStatusHistoryRepo: OrderStatusHistoryRepository,
    private logger: LoggerPort,
  ) {}

  async execute(data: OrderCreateRequest): Promise<OrderResponse> {
    const now = new Date()
    const items: OrderItem[] = []
    let subtotal = 0

    for (const item of data.items) {
      const product = await this.productRepo.findById(item.productId)
      if (!product) {
        this.logger.warn('order.create.product_not_found', {
          productId: item.productId,
        })
        throw new AppError(`Product ${item.productId} not found`, 400)
      }
      const totalPrice = product.price * item.quantity
      subtotal += totalPrice
      items.push(
        new OrderItem(
          crypto.randomUUID(),
          '',
          product.id,
          item.quantity,
          product.price,
          totalPrice,
          now,
          now,
          null,
        ),
      )
    }

    if (data.productRequestId) {
      const request = await this.productRequestRepo.findById(
        data.productRequestId,
      )
      if (!request) {
        this.logger.warn('order.create.request_not_found', {
          productRequestId: data.productRequestId,
        })
        throw new AppError('Product request not found', 400)
      }
      if (
        ![
          ProductRequestStatus.Pending,
          ProductRequestStatus.Quoted,
        ].includes(request.status)
      ) {
        throw new AppError('Product request is not available', 400)
      }
    }

    let discount = 0
    let couponId: string | null = null
    if (data.couponCode) {
      const coupon = await this.couponRepo.findByCode(data.couponCode)
      if (coupon && coupon.active) {
        couponId = coupon.id
        if (coupon.type === CouponType.Percentage) {
          discount = (subtotal * coupon.value) / 100
        } else {
          discount = coupon.value
        }
        if (coupon.maxDiscountAmount) {
          discount = Math.min(discount, coupon.maxDiscountAmount)
        }
      }
    }

    const total = Math.max(subtotal - discount, 0)
    const order = new Order(
      crypto.randomUUID(),
      data.customerId,
      data.addressId,
      couponId,
      data.productRequestId ?? null,
      data.isPreorder ?? false,
      OrderStatus.Pending,
      subtotal,
      discount,
      total,
      now,
      now,
      null,
    )

    await this.orderRepo.create(order)

    for (const item of items) {
      const savedItem = new OrderItem(
        item.id,
        order.id,
        item.productId,
        item.quantity,
        item.unitPrice,
        item.totalPrice,
        item.createdAt,
        item.updatedAt,
        item.deletedAt,
      )
      await this.orderItemRepo.create(savedItem)

      if (!data.isPreorder) {
        const inventory = await this.inventoryRepo.findByProductId(
          item.productId,
        )
        if (inventory) {
          const available = inventory.quantityAvailable - item.quantity
          if (available < 0) {
            this.logger.warn('order.create.insufficient_stock', {
              productId: item.productId,
              available,
            })
            throw new AppError('Insufficient stock', 400)
          }
          const reserved = inventory.quantityReserved + item.quantity
          const updatedInventory = new Inventory(
            inventory.id,
            inventory.productId,
            available,
            reserved,
            inventory.createdAt,
            now,
            inventory.deletedAt,
          )
          await this.inventoryRepo.update(updatedInventory)

          const movement = new InventoryMovement(
            crypto.randomUUID(),
            inventory.productId,
            InventoryMovementType.Reserve,
            item.quantity,
            InventoryMovementReferenceType.Order,
            order.id,
            now,
            now,
            null,
          )
          await this.inventoryMovementRepo.create(movement)
        }
      }
    }

    const history = new OrderStatusHistory(
      crypto.randomUUID(),
      order.id,
      OrderStatus.Draft,
      OrderStatus.Pending,
      OrderStatusChangedBy.System,
      now,
      now,
      null,
    )
    await this.orderStatusHistoryRepo.create(history)

    this.logger.info('order.create.success', {
      orderId: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
    })

    return {
      id: order.id,
      customerId: order.customerId,
      addressId: order.addressId,
      couponId: order.couponId,
      status: order.status,
      productRequestId: order.productRequestId,
      isPreorder: order.isPreorder,
      subtotalAmount: order.subtotalAmount,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      deletedAt: order.deletedAt?.toISOString() ?? null,
    }
  }
}
