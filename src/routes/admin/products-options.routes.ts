import { Router } from 'express'
import { ProductOptionsDatasource } from '../../datasources/admin/product-options.datasource'
import { ProductOptionsController } from '../../controllers/admin/product-options.controller'
import { ProductOptionsRepository } from '../../repositories/admin/product-options.repository'

export class ProductsOptionsAdminRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new ProductOptionsDatasource()
    const repository = new ProductOptionsRepository(datasource)

    const controller = new ProductOptionsController(repository)

    router.post('/', controller.create)
    router.patch('/:productOptionsId', controller.update)
    router.patch('/:productOptionsId/toggle-status', controller.toggleStatus)

    router.get('/', controller.getAll)
    router.get('/:productOptionsId', controller.getById)

    router.delete('/:productOptionsId', controller.delete)

    return router
  }
}
