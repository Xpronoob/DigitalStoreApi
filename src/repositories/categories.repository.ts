import { number } from "zod";
import { CategoriesDatasource } from "../datasources/categories.datasource";
import { CategoryEntity, CategoryEntityOptional } from '../entities/category.entity';

export class CategoriesRepository {
  constructor(private readonly categoriesDatasource: CategoriesDatasource) {}

  async create(categoryData: CategoryEntity) {
    return await this.categoriesDatasource.create(categoryData);
  }

  async update(categoryId: number, categoryData: CategoryEntityOptional) {
    return await this.categoriesDatasource.update(categoryId, categoryData);
  }

  async delete(categoryId: number) {
    return await this.categoriesDatasource.delete(categoryId);
  }

  async getAll() {
    return await this.categoriesDatasource.getAll();
  }

  async getById(categoryId: number) {
    return await this.categoriesDatasource.getById(categoryId);
  }
}
