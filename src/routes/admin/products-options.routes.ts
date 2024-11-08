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

    router.post('/', controller.createOptions)
    router.patch('/:productOptionsId', controller.updateOptions)
    router.patch('/:productOptionsId/toggle-status', controller.toggleStatusProductOptions)

    router.get('/', controller.productOptionGetAll)
    router.get('/:productOptionsId', controller.productOptionGetById)

    return router
  }
}
