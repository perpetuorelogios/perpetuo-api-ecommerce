export enum InventoryMovementType {
  In = 'in',
  Out = 'out',
  Reserve = 'reserve',
  Release = 'release',
  Adjust = 'adjust',
}

export enum InventoryMovementReferenceType {
  Order = 'order',
  Cancel = 'cancel',
  Return = 'return',
  Manual = 'manual',
}

export enum CouponType {
  Percentage = 'percentage',
  Fixed = 'fixed',
}

export enum OrderStatus {
  Draft = 'draft',
  Pending = 'pending',
  Paid = 'paid',
  Completed = 'completed',
  Canceled = 'canceled',
  Refunded = 'refunded',
}

export enum OrderStatusChangedBy {
  System = 'system',
  Admin = 'admin',
  Customer = 'customer',
}

export enum PaymentMethod {
  CreditCard = 'credit_card',
  Pix = 'pix',
  Boleto = 'boleto',
  Transfer = 'transfer',
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
  Refunded = 'refunded',
}

export enum PaymentProvider {
  Asaas = 'asaas',
}

export enum PaymentProfileType {
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
  Wallet = 'wallet',
}

export enum ShippingStatus {
  Pending = 'pending',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Returned = 'returned',
}

export enum ProductRequestStatus {
  Pending = 'pending',
  Quoted = 'quoted',
  Completed = 'completed',
  Canceled = 'canceled',
}

export enum PaymentLinkBillingType {
  Undefined = 'UNDEFINED',
  CreditCard = 'CREDIT_CARD',
  Boleto = 'BOLETO',
  Pix = 'PIX',
  Transfer = 'TRANSFER',
}

export enum PaymentLinkChargeType {
  Detached = 'DETACHED',
  Installment = 'INSTALLMENT',
  Recurrent = 'RECURRENT',
}

export enum PaymentLinkSubscriptionCycle {
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY',
}

export enum PaymentLinkStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
  Canceled = 'canceled',
}

export enum UserRole {
  Admin = 'admin',
  Seller = 'seller',
  Customer = 'customer',
}
