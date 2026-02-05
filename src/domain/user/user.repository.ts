import { User } from "./user.entity"

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<void>
}
