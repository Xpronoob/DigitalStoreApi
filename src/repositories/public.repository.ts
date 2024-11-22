import { Request } from 'express'
import { PublicDatasource } from '../datasources/public.datasources'

export class PublicRepository {
  constructor(private readonly publicDatasource: PublicDatasource) {}

  async getAllProducts(req: Request) {
    return await this.publicDatasource.getAllProducts(req)
  }

  async getProductDetailsById(productId: number) {
    return await this.publicDatasource.getProductDetailsById(productId)
  }
}
