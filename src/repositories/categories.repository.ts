import { CategoriesDatasource } from "../datasources/categories.datasource";

export class CategoriesRepository {
  constructor(private readonly categoriesDatasource: CategoriesDatasource) {}

  async create(categoryData: { name: string }) {
    return await this.categoriesDatasource.create(categoryData);
  }

  async update(categoryId: number, categoryData: { name: string }) {
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
