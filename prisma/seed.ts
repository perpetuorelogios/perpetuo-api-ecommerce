import { PrismaClient } from '../src/generated/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcrypt'

const ensureSslMode = (url?: string) => {
  if (!url) return url
  try {
    const parsed = new URL(url)
    if (!parsed.searchParams.get('sslmode')) {
      parsed.searchParams.set('sslmode', 'require')
    }
    return parsed.toString()
  } catch {
    if (url.includes('sslmode=')) return url
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}sslmode=require`
  }
}

const url = ensureSslMode(process.env.DIRECT_URL || process.env.DATABASE_URL)
console.log('🔗 Database URL:', url?.substring(0, 50) + '...')

const adapter = new PrismaPg({ connectionString: url })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed de dados...')

  // Email do admin padrão
  const adminEmail = 'admin@perpetuo.com'
  const adminPassword = 'Admin@123456'
  const adminName = 'Admin Perpetuo'

  // Verifica se o admin já existe
  const existingAdmin = await prisma.customer.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log(`✅ Admin '${adminEmail}' já existe. Pulando seed.`)
    return
  }

  // Cria o hash da senha
  const hashedPassword = await hash(adminPassword, 10)

  // Cria o admin
  const admin = await prisma.customer.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin', // UserRole.Admin
      document: '',
      phone: '',
    },
  })

  console.log(`✨ Admin criado com sucesso!`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   Senha: ${adminPassword}`)
  console.log(`   Role: ${admin.role}`)
  console.log(`\n⚠️  IMPORTANTE: Guarde essas credenciais e mude a senha no primeiro login!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('✅ Seed finalizado!')
  })
  .catch(async (e) => {
    console.error('❌ Erro durante seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
