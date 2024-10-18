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

  async addRole(userId: number, roleId: number) {
    return await this.usersDatasource.addRole(userId, roleId)
  }

  async removeRole(userId: number, roleId: number) {
    return await this.usersDatasource.removeRole(userId, roleId)
  }

  async getRoles(userId: number) {
    return await this.usersDatasource.getRoles(userId)
  }

  async activate(userId: number) {
    return await this.usersDatasource.activate(userId)
  }

  async desactivate(userId: number) {
    return await this.usersDatasource.desactivate(userId)
  }

  async getCartItems(userId: number) {
    return await this.usersDatasource.getCartItems(userId)
  }

  async getOrders(userId: number) {
    return await this.usersDatasource.getOrders(userId)
  }
}
