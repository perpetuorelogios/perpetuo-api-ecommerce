# Roadmap de Testes Locais

Base URL: http://localhost:3000

## 1) Subir stack + API
1. `docker compose up --build -d`
2. `npm i`
3. `npx prisma generate`
4. `npm run start:dev`
5. (Opcional) `npm run start:worker`

## 2) Health
- `GET /health`
  - Confirma API viva.

## 3) Auth
1. `POST /register`
```json
{ "name":"Ana", "email":"ana@mail.com", "password":"123456", "document":"12345678901", "phone":"+5511999999999" }
```
2. `POST /login`
```json
{ "email":"ana@mail.com", "password":"123456" }
```
- Guarde `accessToken` e `sessionId`.
- Para criar/editar/excluir produtos, o usuario precisa ter role `admin` ou `seller`.

## 4) Produtos (JWT)
Header: `Authorization: Bearer <accessToken>`
1. `POST /v1/products`
```json
{ "name":"Produto A", "brand":"Marca", "model":"M1", "sku":"SKU-001", "price":199.9, "quantityAvailable":10, "isPreorder":false }
```
2. `GET /v1/products`
3. `GET /v1/products/:id`
4. `PATCH /v1/products/:id`
```json
{ "price": 229.9, "active": true }
```
5. `DELETE /v1/products/:id`

## 5) Addresses
1. `POST /v1/customers/:customerId/addresses`
```json
{ "street":"Rua 1", "number":"10", "city":"SP", "state":"SP", "zipCode":"01000-000" }
```
2. `GET /v1/customers/:customerId/addresses`

## 6) Cupons (opcional)
1. `POST /v1/coupons`
```json
{ "code":"DESC10", "type":"percentage", "value":10 }
```
2. `GET /v1/coupons/DESC10`

## 7) Pedidos
1. `POST /v1/orders`
```json
{
  "customerId":"<customerId>",
  "addressId":"<addressId>",
  "couponCode":"DESC10",
  "items":[{ "productId":"<productId>", "quantity":1 }]
}
```
2. `GET /v1/orders/:id`
3. `GET /v1/orders/:id/items`

## 8) Pagamentos
1. `POST /v1/payments`
```json
{ "orderId":"<orderId>", "method":"pix", "installments":1 }
```
2. `GET /v1/orders/:id/payment`
3. `GET /v1/payments/:paymentId/transactions`

## 9) Webhook (simulacao)
- `POST /webhooks/asaas`
  - Header: `asaas-access-token: <ASAAS_WEBHOOK_TOKEN>`
  - Payload: usar um mock basico da Asaas com `event`, `payment.id`, `payment.status`, `payment.externalReference`, `payment.paymentLink` (quando for link).

## 10) Shipping
1. `POST /v1/orders/:orderId/shipping`
```json
{ "status":"pending", "carrier":"Correios", "trackingCode":"BR123" }
```
2. `GET /v1/orders/:orderId/shipping`

---

# Fluxo Sob Encomenda

## A) Criar solicitacao
- `POST /v1/product-requests`
```json
{ "customerId":"<customerId>", "productId":"<productId>", "quantity":1, "notes":"Preciso em 30 dias" }
```
- Resposta inclui `paymentLinkUrl` e `paymentLinkId`.

## B) (Opcional) Cotar/alterar link (admin/vendedor)
- `PATCH /v1/product-requests/:id/quote`
```json
{ "paymentLinkUrl":"https://link.asaas.com/..." }
```

## C) Criar pedido sob encomenda
- `POST /v1/orders`
```json
{
  "customerId":"<customerId>",
  "addressId":"<addressId>",
  "productRequestId":"<requestId>",
  "isPreorder":true,
  "items":[{ "productId":"<productId>", "quantity":1 }]
}
```

Quando o pagamento for confirmado via webhook, a solicitacao sera marcada como concluida.
