import { z } from "zod";
import { CustomError } from "../errors/custom.error";
import {  CategoryEntity } from "../entities/category.entity";

export class ZodCategoriesAdapter {

  static validateCategory = (category: CategoryEntity) => {

    const Category = z.object({
      category_name: z.string({
        required_error: "El nombre de la categoría es requerido"
      }).min(3, "El nombre debe tener al menos 3 caracteres").max(50, "El nombre no puede tener más de 50 caracteres"),
    });

    try {
      return Category.parse(category);

    } catch (error) {
      if (error instanceof z.ZodError) {
        
        throw CustomError.badRequest(error.errors[0].message);
      }
      throw CustomError.internalServer();
    }
  }
}
