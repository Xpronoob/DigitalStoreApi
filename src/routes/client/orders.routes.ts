import { Router } from 'express'
import { ProductDetailsController } from '../../controllers/admin/product-details.controller'
import { ProductDetailsDatasource } from '../../datasources/admin/product-details.datasource'
import { ProductDetailsRepository } from '../../repositories/admin/product-details.repository'

export class OrdersClientRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new ProductDetailsDatasource()
    const repository = new ProductDetailsRepository(datasource)

    const controller = new ProductDetailsController(repository)

    router.post('/', controller.create)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)

    return router
  }
}
