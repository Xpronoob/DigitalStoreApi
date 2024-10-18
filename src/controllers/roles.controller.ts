import { Request, Response } from "express"
import { CustomError } from "../errors/custom.error"
import { ZodRolesAdapter } from "../adapters/zod.roles.adapter"
import { RolesRepository } from "../repositories/roles.repository"

  //DI
  export class RolesController {
  constructor(private readonly rolesRepository: RolesRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodRolesAdapter.validateRole(req.body)
      const role = await this.rolesRepository.create(validatedData)

      if (!role) throw CustomError.internalServer("Error al crear el rol")

      res.status(201).json({
        message: "Rol creado exitosamente",
        role,
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
      const validatedData = ZodRolesAdapter.validateRole(req.body)

      const updatedRole = await this.rolesRepository.update(parseInt(req.params.id), validatedData)

      if (!updatedRole) throw CustomError.internalServer("Error al actualizar el rol")

      res.status(200).json({
        message: "Rol actualizado exitosamente",
        updatedRole,
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
      const deletedRole = await this.rolesRepository.delete(parseInt(req.params.id))

      if (!deletedRole) throw CustomError.internalServer("Error al eliminar el rol")

      res.status(200).json({
        message: "Rol eliminado exitosamente",
        deletedRole,
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
      const roles = await this.rolesRepository.getAll()

      if (!roles) throw CustomError.internalServer("No se encontraron roles")

      res.status(200).json({
        message: "Roles obtenidos exitosamente",
        roles,
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
      const role = await this.rolesRepository.getById(parseInt(req.params.id))
      res.status(200).json(role)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }
}