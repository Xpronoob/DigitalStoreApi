import { PrismaClient } from "@prisma/client"
import { CustomError } from "../errors/custom.error"
import { UserEntity, UserEntityOptional } from "../entities/user.entity"

const prisma = new PrismaClient()

export class UsersDatasource {

  async create(userData: UserEntity) {
    try {
      console.log(userData)
      const user = await prisma.users.create({
        data: 
          {
            email: userData.email,
            password: userData.password,
            active: userData.active,
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone_number: userData.phone_number,
            img: userData.img
          }
      })
      return user
    } catch (error) {
      throw CustomError.internalServer("Error al crear el usuario")
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
          img: userData.img
        }
      })
      return updatedUser
    } catch (error) {
      throw CustomError.internalServer("Error al actualizar el usuario")
    }
  }

  async delete(userId: number) {
    try {
      const deletedUser = await prisma.users.delete({
        where: { user_id: userId },
      })
      return deletedUser
    } catch (error) {
      throw CustomError.internalServer("Error al eliminar el usuario")
    }
  }

  async getAll() {
    try {
      const users = await prisma.users.findMany()
      return users
    } catch (error) {
      throw CustomError.internalServer("Error al obtener los usuarios")
    }
  }

  async getById(userId: number) {
    try {
      const user = await prisma.users.findUnique({
        where: { user_id: userId },
      })
      if (!user) {
        throw CustomError.notFound("Usuario no encontrada")
      }
      return user
    } catch (error) {
      throw CustomError.internalServer("Error al obtener el usuario")
    }
  }
}
