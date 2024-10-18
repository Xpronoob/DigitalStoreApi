import { UsersDatasource } from "../datasources/users.datasource"
import { UserEntity, UserEntityOptional } from "../entities/user.entity"

export class UsersRepository {
  constructor(private readonly usersDatasource: UsersDatasource) {}

  async create(userData: UserEntity) {
    return await this.usersDatasource.create(userData)
  }

  async update(userId: number, userData: UserEntityOptional) {
    return await this.usersDatasource.update(userId, userData)
  }

  async delete(userId: number) {
    return await this.usersDatasource.delete(userId)
  }

  async getAll() {
    return await this.usersDatasource.getAll()
  }

  async getById(userId: number) {
    return await this.usersDatasource.getById(userId)
  }
}
