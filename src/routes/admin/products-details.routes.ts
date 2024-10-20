import { Router } from 'express'
import { ProductDetailsController } from '../../controllers/admin/products-details.controller'
import { ProductDetailsDatasource } from '../../datasources/admin/products-details.datasource'
import { ProductDetailsRepository } from '../../repositories/admin/products-details.repository'

export class ProductDetailsAdminRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new ProductDetailsDatasource()
    const repository = new ProductDetailsRepository(datasource)

    const controller = new ProductDetailsController(repository)

    router.post('/', controller.create)
    router.patch('/:id', controller.update)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)

    router.patch('/:productDetailId/toggle-status', controller.toggleStatus)

    return router
  }
}
