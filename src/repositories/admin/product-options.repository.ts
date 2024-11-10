import { ProductOptionsDatasource } from '../../datasources/admin/product-options.datasource'
import { ProductOptionsEntity } from '../../entities/product-options.entity'

export class ProductOptionsRepository {
  constructor(private readonly productOptionsDatasource: ProductOptionsDatasource) {}

  async create(productOptionsData: ProductOptionsEntity) {
    return await this.productOptionsDatasource.create(productOptionsData)
  }

  async update(productOptionsId: number, productOptionsData: ProductOptionsEntity) {
    return await this.productOptionsDatasource.update(productOptionsId, productOptionsData)
  }

  async toggleStatus(productOptionsId: number, active: boolean) {
    return await this.productOptionsDatasource.toggleStatus(productOptionsId, active)
  }

  async getById(productOptionsId: number) {
    return await this.productOptionsDatasource.getById(productOptionsId)
  }

  async getAll() {
    return await this.productOptionsDatasource.getAll()
  }

  async delete(productOptionsId: number) {
    return await this.productOptionsDatasource.delete(productOptionsId)
  }
}
