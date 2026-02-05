import bcrypt from 'bcrypt'
import { User } from '../../domain/user/user.entity'
import type { UserRepository } from '../../domain/user/user.repository'
import type { RegisterRequest } from '../dtos/register.dto'

export class RegisterUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(data: RegisterRequest) {
    const hash = await bcrypt.hash(data.password, 10)
    const user = new User(crypto.randomUUID(), data.email, hash)
    await this.userRepo.create(user)
  }
}
