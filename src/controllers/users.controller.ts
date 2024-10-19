import { Request, Response } from "express"
import { UsersRepository } from "../repositories/users.repository"
import { ZodUsersAdapter } from "../adapters/zod.users.adapter"
import { CustomError } from "../errors/custom.error"
import { BcryptAdapter } from "../adapters/bcrypt.adapter"

  //DI
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodUsersAdapter.validateUser(req.body)
      validatedData.password = BcryptAdapter.hash(validatedData.password)
      validatedData.email = validatedData.email.toLowerCase()
      const user = await this.usersRepository.create(validatedData)

      if (!user) throw CustomError.internalServer("Error al crear el usuario")

      res.status(201).json({
        message: "Usuario creado exitosamente",
        user,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }


  update = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodUsersAdapter.validateUserUpdate(req.body)
      if(validatedData.password){
        validatedData.password = BcryptAdapter.hash(validatedData.password)
      }
      if(validatedData.email){
      validatedData.email = validatedData.email.toLowerCase()
      }
      const updatedUser = await this.usersRepository.update(parseInt(req.params.id), validatedData)

      if (!updatedUser) throw CustomError.internalServer("Error al actualizar el usuario")

      res.status(200).json({
        message: "Usuario actualizado exitosamente",
        updatedUser,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }


  delete = async (req: Request, res: Response) => {
    try {
      const deletedUser = await this.usersRepository.delete(parseInt(req.params.id))

      if (!deletedUser) throw CustomError.internalServer("Error al eliminar el usuario")

      res.status(200).json({
        message: "Usuario eliminado exitosamente",
        deletedUser,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const users = await this.usersRepository.getAll()

      if (!users) throw CustomError.internalServer("No se encontraron usuarios")

      res.status(200).json({
        message: "Usuarios obtenidos exitosamente",
        users,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const user = await this.usersRepository.getById(parseInt(req.params.id))
      res.status(200).json(user)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }

  addRole = async(req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId)
      const roleId = parseInt(req.params.roleId)
      if(!userId || !roleId) throw CustomError.badRequest("Faltan parámetros")
      
      const userWithRole = await this.usersRepository.addRole(userId, roleId)
      res.status(200).json({
        message: "Rol agregado exitosamente",
        user_role: userWithRole
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  removeRole = async(req: Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    const roleId = parseInt(req.params.roleId)
    try {
      if(!userId || !roleId) throw CustomError.badRequest("No encontrado")
      
      const userWithRole = await this.usersRepository.removeRole(userId, roleId)
      res.status(200).json({
        message: "Rol eliminado exitosamente",
        user_role: userWithRole
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getRoles = async (req: Request, res: Response) => {
    try {
      const user = await this.usersRepository.getRoles(parseInt(req.params.userId))
      res.status(200).json(user)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }

  activate = async (req: Request, res: Response) => {
    try {
      const updatedUser = await this.usersRepository.activate(parseInt(req.params.userId))

      if (!updatedUser) throw CustomError.internalServer("Error al activar el usuario")

      res.status(200).json({
        message: "Usuario activado exitosamente",
        updatedUser,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  desactivate = async (req: Request, res: Response) => {
    try {
      const updatedUser = await this.usersRepository.desactivate(parseInt(req.params.userId))

      if (!updatedUser) throw CustomError.internalServer("Error al desactivar el usuario")

      res.status(200).json({
        message: "Usuario desactivado exitosamente",
        updatedUser,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getCartItems = async (req: Request, res: Response) => {
    try {
      const user = await this.usersRepository.getCartItems(parseInt(req.params.userId))
      res.status(200).json(user)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }

  getOrders = async (req: Request, res: Response) => {
    try {
      const user = await this.usersRepository.getOrders(parseInt(req.params.userId))
      res.status(200).json(user)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }
}