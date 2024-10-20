import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { CategoryEntity, CategoryEntityOptional } from '../../entities/category.entity'

const prisma = new PrismaClient()

export class CategoriesDatasource {
  async create(categoryData: CategoryEntity) {
    try {
      const category = await prisma.categories.create({
        data: {
          category_name: categoryData.category_name,
          active: categoryData.active,
          img: categoryData.img,
        },
      })
      return category
    } catch (error) {
      throw CustomError.internalServer('Error al crear la categoría')
    }
  }

  async update(categoryId: number, categoryData: CategoryEntityOptional) {
    try {
      const updatedCategory = await prisma.categories.update({
        where: { category_id: categoryId },
        data: {
          category_name: categoryData.category_name,
          active: categoryData.active,
          img: categoryData.img,
        },
      })
      return updatedCategory
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar la categoría')
    }
  }

  async delete(categoryId: number) {
    try {
      const deletedCategory = await prisma.categories.delete({
        where: { category_id: categoryId },
      })
      return deletedCategory
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar la categoría')
    }
  }

  async getAll() {
    try {
      const categories = await prisma.categories.findMany()
      return categories
    } catch (error) {
      throw CustomError.internalServer('Error al obtener las categorías')
    }
  }

  async getById(categoryId: number) {
    try {
      const category = await prisma.categories.findUnique({
        where: { category_id: categoryId },
      })
      if (!category) {
        throw CustomError.notFound('Categoría no encontrada')
      }
      return category
    } catch (error) {
      throw CustomError.internalServer('Error al obtener la categoría')
    }
  }

  async toggleStatus(categoryId: number, active: boolean) {
    try {
      const updatedCategory = await prisma.categories.update({
        where: { category_id: categoryId },
        data: {
          active: active,
        },
      })
      return updatedCategory
    } catch (error) {
      throw CustomError.internalServer(`Error al ${active ? 'activar' : 'desactivar'} la categoría`)
    }
  }
}
