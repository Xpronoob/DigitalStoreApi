import { Request, Response } from 'express'
import { ZodCategoriesAdapter } from '../../adapters/zod.categories.adapter'
import { CustomError } from '../../errors/custom.error'
import { CategoriesRepository } from '../../repositories/admin'

//DI
export class CategoriesController {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodCategoriesAdapter.validateCategory(req.body)
      const category = await this.categoriesRepository.create(validatedData)

      if (!category) throw CustomError.internalServer('Error al crear la categoría')

      res.status(201).json({
        message: 'Categoría creada exitosamente',
        category,
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
      const validatedData = ZodCategoriesAdapter.validateCategory(req.body)

      const updatedCategory = await this.categoriesRepository.update(parseInt(req.params.id), validatedData)

      if (!updatedCategory) throw CustomError.internalServer('Error al actualizar la categoría')

      res.status(200).json({
        message: 'Categoría actualizada exitosamente',
        updatedCategory,
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
      const deletedCategory = await this.categoriesRepository.delete(parseInt(req.params.id))

      if (!deletedCategory) throw CustomError.internalServer('Error al eliminar la categoría')

      res.status(200).json({
        message: 'Categoría eliminada exitosamente',
        deletedCategory,
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
      const categories = await this.categoriesRepository.getAll()

      if (!categories) throw CustomError.internalServer('No se encontraron categorías')

      res.status(200).json({
        message: 'Categorías obtenidas exitosamente',
        categories,
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
      const category = await this.categoriesRepository.getById(parseInt(req.params.id))
      res.status(200).json(category)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }

  toggleStatus = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params
      const { active } = req.body

      const updatedCategory = await this.categoriesRepository.toggleStatus(parseInt(categoryId), active)

      if (!updatedCategory) throw CustomError.internalServer('Error al actualizar el estado de la categoría')

      res.status(200).json({
        message: active ? 'Categoría activada exitosamente' : 'Categoría desactivada exitosamente',
        updatedCategory,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }
}
