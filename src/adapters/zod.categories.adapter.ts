import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import { CategoryEntity, CategoryEntityOptional } from '../entities/category.entity'

export class ZodCategoriesAdapter {
  static validateCategory = (category: CategoryEntity) => {
    const Category = z.object({
      category_name: z
        .string({
          required_error: 'El nombre de la categoría es requerido',
        })
        .min(1, 'El nombre de la categoría debe tener al menos 1 carácter')
        .max(255, 'El nombre de la categoría no puede tener más de 255 caracteres'),
      active: z.boolean(),
      img: z.string().optional(),
    })

    try {
      return Category.parse(category)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateCategoryUpdate = (category: CategoryEntityOptional) => {
    const Category = z.object({
      category_name: z
        .string()
        .min(1, 'El nombre de la categoría debe tener al menos 1 carácter')
        .max(255, 'El nombre de la categoría no puede tener más de 255 caracteres')
        .optional(),
      active: z.boolean().optional(),
      img: z.string().optional(),
    })

    try {
      return Category.parse(category)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
