# 🔐 GitHub Secrets - Perpetuo API

Este documento lista todos os secretos necessários configurar no GitHub Actions para os deploys funcionarem.

## ⚙️ Acesso aos Secrets

1. Acesse: **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**

---

## 📋 Secretos Necessários

### 🔑 SSH & Servidor
| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `SSH_HOST` | Host do servidor (IP ou domínio) | `123.45.67.89` |
| `SSH_PRIVATE_KEY` | Chave SSH privada (em base64 ou conteúdo direto) | `-----BEGIN PRIVATE KEY-----...` |

---

### 🗄️ Database (HML)
| Secret | Descrição | Formato |
|--------|-----------|---------|
| `HML_DATABASE_URL` | URL completa com credenciais HML | `postgresql://user:pass@host:5432/db` |
| `HML_DIRECT_URL` | URL direta para Prisma (sem pool) | `postgresql://user:pass@host:5432/db` |

---

### 🗄️ Database (PROD)
| Secret | Descrição | Formato |
|--------|-----------|---------|
| `PROD_DATABASE_URL` | URL completa com credenciais PROD | `postgresql://user:pass@host:5432/db` |
| `PROD_DIRECT_URL` | URL direta para Prisma (sem pool) | `postgresql://user:pass@host:5432/db` |

---

### 🔐 JWT
| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `JWT_SECRET_HML` | Secret para assinar tokens JWT (HML) | `my-super-secret-key-hml-12345` |
| `JWT_SECRET` | Secret para assinar tokens JWT (PROD) | `my-super-secret-key-prod-67890` |

---

### 🔴 Redis (PROD)
| Secret | Descrição | Formato |
|--------|-----------|---------|
| `PROD_REDIS_URL` | URL do Redis PROD com credenciais | `redis://user:pass@host:port` |

---

### 💳 Asaas (Pagamentos)
| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `ASAAS_API_URL` | Base URL da API Asaas | `https://api.asaas.com` |
| `ASAAS_API_KEY` | API Key Asaas (PROD) | `$aact_u000000...` |
| `ASAAS_API_KEY_HML` | API Key Asaas (HML/Sandbox) | `$aact_hmlg_000...` |
| `ASAAS_WEBHOOK_TOKEN` | Token para validar webhooks (PROD) | `abc123def456...` |
| `ASAAS_WEBHOOK_TOKEN_HML` | Token para validar webhooks (HML) | `xyz789uvw012...` |

---

## 📝 Checklist de Configuração

- [ ] SSH_HOST definido
- [ ] SSH_PRIVATE_KEY definido (sem quebras de linha extras)
- [ ] HML_DATABASE_URL definida
- [ ] HML_DIRECT_URL definida
- [ ] PROD_DATABASE_URL definida
- [ ] PROD_DIRECT_URL definida
- [ ] JWT_SECRET_HML definido
- [ ] JWT_SECRET definido
- [ ] PROD_REDIS_URL definida
- [ ] ASAAS_API_URL definida
- [ ] ASAAS_API_KEY definida
- [ ] ASAAS_API_KEY_HML definida
- [ ] ASAAS_WEBHOOK_TOKEN definido
- [ ] ASAAS_WEBHOOK_TOKEN_HML definido

---

## 🚀 Como Usar

Após configurar todos os secrets:

1. **HML (Homologação)**: Faça push na branch `develop`
   ```bash
   git push origin develop
   ```
   A workflow `deploy-hml.yml` será acionada automaticamente.

2. **PROD (Produção)**: Faça push na branch `main`
   ```bash
   git push origin main
   ```
   A workflow `deploy-prod.yml` será acionada automaticamente.

---

## 📌 Notas Importantes

- ✅ **Seed automático**: O admin padrão (`admin@perpetuo.com`) será criado automaticamente na primeira execução
- ✅ **Senha padrão**: `Admin@123456` (mude no primeiro login!)
- ⚠️ **Caracteres especiais**: As URLs com senhas especiais (%, @, #) já são tratadas corretamente pelas pipelines
- 🔒 **Nunca comite secrets** no Git - use apenas GitHub Secrets

---

## 🆘 Troubleshooting

### Erro: "Could not connect to database"
- Verifique se `DATABASE_URL` e `DIRECT_URL` estão corretas
- Confirme que o servidor pode acessar o banco de dados

### Erro: "Invalid JWT token"
- Certifique-se de que `JWT_SECRET` é igual entre HML e PROD (ou diferente, conforme configurado)
- Não mude o secret durante produção (invalida tokens existentes)

### Erro: "Asaas API Key invalid"
- Confirme que você colou toda a chave Asaas (começam com `$aact_`)
- Use sandbox keys para HML e produção para PROD

---

## 📚 Referências

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Asaas Documentation](https://docs.asaas.com)
- [Prisma Database URL Format](https://www.prisma.io/docs/orm/reference/connection-string-reference)
