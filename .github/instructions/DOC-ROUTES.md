# API Routes

## Publicas

### Health
- **GET /health**
  - Retorna status da API, uptime, timestamp e versao.

### Auth
- **POST /register**
  - Cria um Customer com senha (hash), email, nome, documento e telefone.
- **POST /login**
  - Autentica Customer por email/senha e retorna JWT.
- **POST /refresh**
  - Rotaciona a sessao e retorna novo access token + sessionId.
- **POST /logout**
  - Revoga a sessao atual.

### Webhooks
- **POST /webhooks/asaas**
  - Recebe postback do Asaas e enfileira processamento do webhook.
  - Eventos comuns: `PAYMENT_CREATED`, `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED`, `PAYMENT_PARTIALLY_REFUNDED`, `PAYMENT_CHARGEBACK_*`.

---

## Protegidas (JWT) — prefixo `/v1`

> Todas as rotas abaixo exigem `Authorization: Bearer <token>`.

### Customers
- **POST /v1/customers**
  - Cria um Customer (com senha hasheada).
- **GET /v1/customers/:id**
  - Busca um Customer por ID (sem senha).

### Addresses
- **POST /v1/customers/:customerId/addresses**
  - Cria endereco para o customer.
- **GET /v1/customers/:customerId/addresses**
  - Lista enderecos do customer.

### Products
- **POST /v1/products**
  - Cria produto e inicializa estoque (inventory).
  - Campo opcional: `isPreorder` para marcar produto sob encomenda.
  - Restrito a admin/vendedor.
- **GET /v1/products**
  - Lista produtos (usa cache).
- **GET /v1/products/:id**
  - Busca produto por ID (usa cache).
- **PATCH /v1/products/:id**
  - Atualiza dados do produto.
  - Restrito a admin/vendedor.
- **DELETE /v1/products/:id**
  - Remove (soft delete) um produto.
  - Restrito a admin/vendedor.

### Coupons
- **POST /v1/coupons**
  - Cria cupom.
- **GET /v1/coupons/:code**
  - Busca cupom por codigo.

### Orders
- **POST /v1/orders**
  - Cria pedido, calcula subtotal/desconto/total, reserva estoque e cria historico de status.
  - Campos adicionais (opcionais):
    - `isPreorder`: quando `true`, nao reserva estoque.
    - `productRequestId`: vincula o pedido a uma solicitacao sob encomenda.
- **GET /v1/orders/:id**
  - Busca pedido por ID.
- **GET /v1/orders/:id/items**
  - Lista itens do pedido.

### Payments
- **POST /v1/payments**
  - Cria pagamento via gateway (Asaas) e registra transacao.
  - Campos adicionais (opcionais):
    - `savePaymentProfile`: quando `true`, salva o cartao usado na compra.
    - `card`: dados do cartao para tokenizacao (obrigatorio quando `savePaymentProfile` for `true`).
- **GET /v1/orders/:id/payment**
  - Busca pagamento por orderId.

### Transactions
- **GET /v1/payments/:paymentId/transactions**
  - Lista transacoes de um pagamento (tentativas, status e payload).

### Payment Profiles
- **POST /v1/customers/:customerId/payment-profiles**
  - Cria cartao/token salvo.
- **GET /v1/customers/:customerId/payment-profiles**
  - Lista perfis de pagamento do customer.

### Shipping
- **POST /v1/orders/:orderId/shipping**
  - Cria entrega do pedido.
- **GET /v1/orders/:orderId/shipping**
  - Busca entrega do pedido.

### Product Requests (Sob Encomenda)
- **POST /v1/product-requests**
  - Cria solicitacao de produto sob encomenda e gera link de pagamento (Asaas).
- **GET /v1/customers/:customerId/product-requests**
  - Lista solicitacoes do customer.
- **PATCH /v1/product-requests/:id/quote**
  - Define link de pagamento e marca como cotada.
- **PATCH /v1/product-requests/:id/complete**
  - Finaliza a solicitacao (some da listagem).