import { PrismaClient } from "@prisma/client";
import { CustomError } from "../errors/custom.error";
import { CategoryEntity } from "../entities/category.entity";

const prisma = new PrismaClient();

export class CategoriesDatasource {

  async create(categoryData: CategoryEntity) {
    try {
      const category = await prisma.categories.create({
        data: 
          {
            category_name: categoryData.category_name
          }
      });
      return category;
    } catch (error) {
      throw CustomError.internalServer("Error al crear la categoría");
    }
  }

  async update(categoryId: number, categoryData: CategoryEntity) {
    try {
      console.log(categoryId)
      console.log(categoryData)
      const updatedCategory = await prisma.categories.update({
        where: { category_id: categoryId },
        data: {category_name: categoryData.category_name}
      });
      return updatedCategory;
    } catch (error) {
      throw CustomError.internalServer("Error al actualizar la categoría");
    }
  }

  async delete(categoryId: number) {
    try {
      const deletedCategory = await prisma.categories.delete({
        where: { category_id: categoryId },
      });
      return deletedCategory;
    } catch (error) {
      throw CustomError.internalServer("Error al eliminar la categoría");
    }
  }

  async getAll() {
    try {
      const categories = await prisma.categories.findMany();
      return categories;
    } catch (error) {
      throw CustomError.internalServer("Error al obtener las categorías");
    }
  }

  async getById(categoryId: number) {
    try {
      const category = await prisma.categories.findUnique({
        where: { category_id: categoryId },
      });
      if (!category) {
        throw CustomError.notFound("Categoría no encontrada");
      }
      return category;
    } catch (error) {
      throw CustomError.internalServer("Error al obtener la categoría");
    }
  }
}
