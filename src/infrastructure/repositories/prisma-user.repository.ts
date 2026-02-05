import { prisma } from '../database/prisma.client.js'
import { User } from '../../domain/user/user.entity.js'
import { UserRepository } from '../../domain/user/user.repository.js'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? new User(user.id, user.email, user.password) : null
  }

  async create(user: User) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
      },
    })
  }
}
