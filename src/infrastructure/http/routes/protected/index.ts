import type { FastifyInstance } from 'fastify'
import { authGuard } from '../../auth.guard.js'
import { CacheService } from '../../../cache/cache.service.js'
import { PrismaCustomerRepository } from '../../../repositories/prisma-customer.repository.js'
import { PrismaAddressRepository } from '../../../repositories/prisma-address.repository.js'
import { PrismaProductRepository } from '../../../repositories/prisma-product.repository.js'
import { PrismaInventoryRepository } from '../../../repositories/prisma-inventory.repository.js'
import { PrismaInventoryMovementRepository } from '../../../repositories/prisma-inventory-movement.repository.js'
import { PrismaCouponRepository } from '../../../repositories/prisma-coupon.repository.js'
import { PrismaOrderRepository } from '../../../repositories/prisma-order.repository.js'
import { PrismaOrderItemRepository } from '../../../repositories/prisma-order-item.repository.js'
import { PrismaOrderStatusHistoryRepository } from '../../../repositories/prisma-order-status-history.repository.js'
import { PrismaPaymentRepository } from '../../../repositories/prisma-payment.repository.js'
import { PrismaPaymentProfileRepository } from '../../../repositories/prisma-payment-profile.repository.js'
import { PrismaPaymentTransactionRepository } from '../../../repositories/prisma-payment-transaction.repository.js'
import { PrismaShippingRepository } from '../../../repositories/prisma-shipping.repository.js'
import { PrismaProductRequestRepository } from '../../../repositories/prisma-product-request.repository.js'
import { PrismaPaymentLinkRepository } from '../../../repositories/prisma-payment-link.repository.js'
import { PaymentService } from '../../../../application/commerce/payment/payment.service.js'
import { AsaasGateway } from '../../../gateways/asaas.gateway.js'
import { registerCustomerRoutes } from './customers/index.js'
import { registerAddressRoutes } from './addresses/index.js'
import { registerProductRoutes } from './products/index.js'
import { registerCouponRoutes } from './coupons/index.js'
import { registerOrderRoutes } from './orders/index.js'
import { registerPaymentRoutes } from './payments/index.js'
import { registerPaymentProfileRoutes } from './payment-profiles/index.js'
import { registerShippingRoutes } from './shipping/index.js'
import { registerTransactionRoutes } from './transactions/index.js'
import { registerProductRequestRoutes } from './product-requests/index.js'

export async function registerProtectedRoutes(app: FastifyInstance) {
  app.register(
    async (protectedRoutes) => {
      protectedRoutes.addHook('preHandler', authGuard)

      const cache = new CacheService()

      const customerRepo = new PrismaCustomerRepository()
      const addressRepo = new PrismaAddressRepository()
      const productRepo = new PrismaProductRepository()
      const inventoryRepo = new PrismaInventoryRepository()
      const inventoryMovementRepo = new PrismaInventoryMovementRepository()
      const couponRepo = new PrismaCouponRepository()
      const orderRepo = new PrismaOrderRepository()
      const orderItemRepo = new PrismaOrderItemRepository()
      const orderStatusHistoryRepo = new PrismaOrderStatusHistoryRepository()
      const paymentRepo = new PrismaPaymentRepository()
      const paymentProfileRepo = new PrismaPaymentProfileRepository()
      const paymentTransactionRepo = new PrismaPaymentTransactionRepository()
      const shippingRepo = new PrismaShippingRepository()
      const productRequestRepo = new PrismaProductRequestRepository()
      const paymentLinkRepo = new PrismaPaymentLinkRepository()

      const paymentGateway = new AsaasGateway(cache)

      const paymentService = new PaymentService(
        paymentRepo,
        paymentTransactionRepo,
        paymentProfileRepo,
        orderRepo,
        customerRepo,
        addressRepo,
        paymentGateway,
      )

      registerCustomerRoutes(protectedRoutes, customerRepo)
      registerAddressRoutes(protectedRoutes, addressRepo)
      registerProductRoutes(protectedRoutes, productRepo, inventoryRepo, cache)
      registerCouponRoutes(protectedRoutes, couponRepo)
      registerOrderRoutes(
        protectedRoutes,
        orderRepo,
        orderItemRepo,
        productRepo,
        inventoryRepo,
        inventoryMovementRepo,
        couponRepo,
        productRequestRepo,
        orderStatusHistoryRepo,
      )
      registerPaymentRoutes(protectedRoutes, paymentService, paymentRepo)
      registerPaymentProfileRoutes(protectedRoutes, paymentProfileRepo)
      registerShippingRoutes(protectedRoutes, shippingRepo)
      registerTransactionRoutes(protectedRoutes, paymentTransactionRepo)
      registerProductRequestRoutes(
        protectedRoutes,
        productRequestRepo,
        productRepo,
        paymentLinkRepo,
        paymentGateway,
      )
    },
    { prefix: '/v1' },
  )
}
