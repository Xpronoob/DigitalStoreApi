import { ProductDetailsDatasource } from '../../datasources/admin/product-details.datasource'
import { ProductDetailsEntity, ProductDetailsEntityOptional } from '../../entities/product-details'

export class ProductDetailsRepository {
  constructor(private readonly productDetailsDatasource: ProductDetailsDatasource) {}

  async create(productDetailData: ProductDetailsEntity) {
    return await this.productDetailsDatasource.create(productDetailData)
  }

  async update(productDetailId: number, productDetailData: ProductDetailsEntityOptional) {
    return await this.productDetailsDatasource.update(productDetailId, productDetailData)
  }

  async delete(productDetailId: number) {
    return await this.productDetailsDatasource.delete(productDetailId)
  }

  async getAll() {
    return await this.productDetailsDatasource.getAll()
  }

  async getById(productDetailId: number) {
    return await this.productDetailsDatasource.getById(productDetailId)
  }

  async toggleStatus(productDetailId: number, active: boolean) {
    return await this.productDetailsDatasource.toggleStatus(productDetailId, active)
  }

  async deleteImg(imgFileName: string) {
    return await this.productDetailsDatasource.deleteImg(imgFileName)
  }
}
