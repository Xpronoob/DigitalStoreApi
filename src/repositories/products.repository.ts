import { ProductsDatasource } from "../datasources/products.datasource";
import { ProductEntity } from '../entities/products.entity';
import { ProductEntityOptional } from '../entities/products.entity';

export class ProductsRepository {
  constructor(private readonly productsDatasource: ProductsDatasource) {}

  async create(productData: ProductEntity) {
    return await this.productsDatasource.create(productData);
  }

  async patch(productId: number, productData: ProductEntityOptional) {
    return await this.productsDatasource.patch(productId, productData);
  }

  async delete(productId: number) {
    return await this.productsDatasource.delete(productId);
  }

  async getAll() {
    return await this.productsDatasource.getAll();
  }

  async getById(productId: number) {
    return await this.productsDatasource.getById(productId);
  }

  async toggleStatus(productId: number, active: boolean) {
    console.log("Hola")
    return await this.productsDatasource.toggleStatus(productId, active);
  }
}