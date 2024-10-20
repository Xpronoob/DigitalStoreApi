import { PrismaClient } from '@prisma/client'
import { CustomError } from '../errors/custom.error'
import { RoleEntity } from '../entities/role.entity'

const prisma = new PrismaClient()

export class RolesDatasource {
  async create(roleData: RoleEntity) {
    try {
      const role = await prisma.roles.create({
        data: {
          role_name: roleData.role_name,
        },
      })
      return role
    } catch (error) {
      throw CustomError.internalServer('Error al crear el rol')
    }
  }

  async update(roleId: number, roleData: RoleEntity) {
    try {
      const updatedRole = await prisma.roles.update({
        where: { role_id: roleId },
        data: { role_name: roleData.role_name },
      })
      return updatedRole
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar el rol')
    }
  }

  async delete(roleId: number) {
    try {
      const deletedRole = await prisma.roles.delete({
        where: { role_id: roleId },
      })
      return deletedRole
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar el rol')
    }
  }

  async getAll() {
    try {
      const roles = await prisma.roles.findMany()
      return roles
    } catch (error) {
      throw CustomError.internalServer('Error al obtener los roles')
    }
  }

  async getById(roleId: number) {
    try {
      const role = await prisma.roles.findUnique({
        where: { role_id: roleId },
      })
      if (!role) {
        throw CustomError.notFound('Rol no encontrada')
      }
      return role
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el rol')
    }
  }
}
