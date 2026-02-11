import { env } from '../../env.js'
import type {
  CreateChargeInput,
  CreateChargeResult,
  CreatePaymentLinkInput,
  CreatePaymentLinkResult,
  PaymentGateway,
  TokenizeCardInput,
  TokenizeCardResult,
} from '../../application/commerce/payment/payment-gateway.js'
import { CacheService } from '../cache/cache.service.js'

type AsaasCustomerResponse = {
  id: string
}

type AsaasPaymentResponse = {
  id: string
  status: string
}

type AsaasCardTokenResponse = {
  token?: string
  creditCardToken?: string
  brand?: string
  creditCardBrand?: string
  last4?: string
  creditCardNumber?: string
}

type AsaasPaymentLinkResponse = {
  id: string
  url: string
}

export class AsaasGateway implements PaymentGateway {
  constructor(private readonly cache: CacheService) {}

  private async request<T>(path: string, options: RequestInit) {
    const baseUrl = env.ASAAS_API_URL.endsWith('/v3')
      ? env.ASAAS_API_URL
      : `${env.ASAAS_API_URL}/v3`
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        access_token: env.ASAAS_API_KEY,
        ...(options.headers || {}),
      },
    })

    const data = (await response.json()) as T

    if (!response.ok) {
      throw new Error(`Asaas error: ${response.status}`)
    }

    return data
  }

  async createPaymentLink(
    input: CreatePaymentLinkInput,
  ): Promise<CreatePaymentLinkResult> {
    const response = await this.request<AsaasPaymentLinkResponse>(
      '/paymentLinks',
      {
        method: 'POST',
        body: JSON.stringify({
          name: input.name,
          description: input.description,
          value: input.value,
          billingType: input.billingType,
          chargeType: input.chargeType,
          dueDateLimitDays: input.dueDateLimitDays,
          maxInstallmentCount: input.maxInstallmentCount,
          subscriptionCycle: input.subscriptionCycle,
          notificationEnabled: input.notificationEnabled,
        }),
      },
    )

    return {
      id: response.id,
      url: response.url,
    }
  }

  private async getOrCreateCustomer(input: CreateChargeInput) {
    const cacheKey = `asaas:customer:${input.customer.email}`
    const cached = await this.cache.getJson<{ id: string }>(cacheKey)
    if (cached?.id) {
      return cached.id
    }

    const customer = await this.request<AsaasCustomerResponse>('/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: input.customer.name,
        email: input.customer.email,
        cpfCnpj: input.customer.document,
        phone: input.customer.phone,
      }),
    })

    await this.cache.setJson(cacheKey, { id: customer.id }, 60 * 60 * 24 * 30)
    return customer.id
  }

  async tokenizeCard(input: TokenizeCardInput): Promise<TokenizeCardResult> {
    const response = await this.request<AsaasCardTokenResponse>(
      '/creditCard/tokenize',
      {
        method: 'POST',
        body: JSON.stringify({
          creditCard: {
            holderName: input.holderName,
            number: input.number,
            expirationMonth: input.expirationMonth,
            expirationYear: input.expirationYear,
            ccv: input.cvv,
          },
        }),
      },
    )

    const token = response.creditCardToken || response.token
    if (!token) {
      throw new Error('Missing card token')
    }

    const brand = response.creditCardBrand || response.brand
    const last4 = response.last4 || response.creditCardNumber?.slice(-4)

    return {
      token,
      ...(brand ? { brand } : {}),
      ...(last4 ? { last4 } : {}),
    }
  }

  async createCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    const customerId = await this.getOrCreateCustomer(input)

    const payload = {
      customer: customerId,
      billingType: input.method.toUpperCase(),
      value: input.amount,
      installmentCount: input.installments || undefined,
      externalReference: input.orderId,
      postalAddress: {
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement || undefined,
        city: input.address.city,
        state: input.address.state,
        postalCode: input.address.zipCode,
      },
    }

    const response = await this.request<AsaasPaymentResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    return {
      externalId: response.id,
      status: response.status,
      raw: response as unknown as Record<string, unknown>,
    }
  }
}
