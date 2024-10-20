import { RolesDatasource } from '../datasources/roles.datasource'
import { RoleEntity } from '../entities/role.entity'

export class RolesRepository {
  constructor(private readonly rolesDatasource: RolesDatasource) {}

  async create(roleData: RoleEntity) {
    return await this.rolesDatasource.create(roleData)
  }

  async update(roleId: number, roleData: RoleEntity) {
    return await this.rolesDatasource.update(roleId, roleData)
  }

  async delete(roleId: number) {
    return await this.rolesDatasource.delete(roleId)
  }

  async getAll() {
    return await this.rolesDatasource.getAll()
  }

  async getById(roleId: number) {
    return await this.rolesDatasource.getById(roleId)
  }
}
