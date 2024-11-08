import { ProductOptionsDatasource } from '../../datasources/admin/product-options.datasource'
import { ProductOptionsEntity } from '../../entities/product-options.entity'

export class ProductOptionsRepository {
  constructor(private readonly productOptionsDatasource: ProductOptionsDatasource) {}

  async createOptions(productOptionsData: ProductOptionsEntity) {
    return await this.productOptionsDatasource.createOptions(productOptionsData)
  }

  async updateOptions(productOptionsId: number, productOptionsData: ProductOptionsEntity) {
    return await this.productOptionsDatasource.updateOptions(productOptionsId, productOptionsData)
  }

  async toggleStatusProductOptions(productOptionsId: number, active: boolean) {
    return await this.productOptionsDatasource.toggleStatusProductOptions(productOptionsId, active)
  }

  async productOptionGetById(productOptionsId: number) {
    return await this.productOptionsDatasource.productOptionGetById(productOptionsId)
  }

  async productOptionGetAll() {
    return await this.productOptionsDatasource.productOptionGetAll()
  }
}
