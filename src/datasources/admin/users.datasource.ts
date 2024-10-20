import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { UserEntity, UserEntityOptional } from '../../entities/user.entity'

const prisma = new PrismaClient()

export class UsersDatasource {
  async create(userData: UserEntity) {
    try {
      const user = await prisma.users.create({
        data: {
          email: userData.email,
          password: userData.password,
          active: userData.active,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number,
          img: userData.img,
        },
      })
      return user
    } catch (error) {
      throw CustomError.internalServer('Error al crear el usuario')
    }
  }

  async update(userId: number, userData: UserEntityOptional) {
    try {
      const updatedUser = await prisma.users.update({
        where: { user_id: userId },
        data: {
          email: userData.email,
          password: userData.password,
          active: userData.active,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number,
          img: userData.img,
        },
      })
      return updatedUser
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar el usuario')
    }
  }

  async delete(userId: number) {
    try {
      const deletedUser = await prisma.users.delete({
        where: { user_id: userId },
      })
      return deletedUser
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar el usuario')
    }
  }

  async getAll() {
    try {
      const users = await prisma.users.findMany()
      return users
    } catch (error) {
      throw CustomError.internalServer('Error al obtener los usuarios')
    }
  }

  async getById(userId: number) {
    try {
      const user = await prisma.users.findUnique({
        where: { user_id: userId },
      })
      if (!user) {
        throw CustomError.notFound('Usuario no encontrada')
      }
      return user
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el usuario')
    }
  }

  async addRole(userId: number, roleId: number) {
    try {
      const userRole = await prisma.users_roles.create({
        data: {
          user_id: userId,
          role_id: roleId,
        },
      })

      return userRole
    } catch (error) {
      throw CustomError.internalServer('Error al agregar el rol al usuario')
    }
  }

  async removeRole(userId: number, roleId: number) {
    try {
      const userRole = await prisma.users_roles.delete({
        where: {
          user_id_role_id: {
            user_id: userId,
            role_id: roleId,
          },
        },
      })

      return userRole
    } catch (error) {
      throw CustomError.internalServer('Error al agregar el rol al usuario')
    }
  }

  async getRoles(userId: number) {
    try {
      const userWithRoles = await prisma.users.findUnique({
        where: {
          user_id: userId,
        },
        include: {
          users_roles: {
            include: {
              roles: true,
            },
          },
        },
      })

      return userWithRoles
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el usuario')
    }
  }

  async toggleStatus(userId: number, active: boolean) {
    try {
      const updatedUser = await prisma.users.update({
        where: { user_id: userId },
        data: {
          active: active,
        },
      })
      return updatedUser
    } catch (error) {
      throw CustomError.internalServer(`Error al ${active ? 'activar' : 'desactivar'} el usuario`)
    }
  }

  async getCartItems(userId: number) {
    try {
      const userWithCartItems = await prisma.users.findUnique({
        where: {
          user_id: userId,
        },
        include: {
          cart_items: true,
        },
      })

      if (!userWithCartItems) {
        throw CustomError.notFound('Carrito de compras no encontrado')
      }

      return userWithCartItems.cart_items
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el Carrito de compras')
    }
  }

  async getOrders(userId: number) {
    try {
      const userWithOrders = await prisma.users.findUnique({
        where: {
          user_id: userId,
        },
        include: {
          orders: true,
        },
      })

      if (!userWithOrders) {
        throw CustomError.notFound('Órdenes de compras no encontradas')
      }

      return userWithOrders.orders
    } catch (error) {
      throw CustomError.internalServer('Error al obtener las Órdenes de compras')
    }
  }
}
