import { Router } from 'express'
import { ProductsController } from '../../controllers/admin/products.controller'
import { ProductsDatasource } from '../../datasources/admin/products.datasource'
import { ProductsRepository } from '../../repositories/admin/products.repository'

export class CartItemsClientRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new ProductsDatasource()
    const repository = new ProductsRepository(datasource)

    const controller = new ProductsController(repository)

    router.post('/', controller.create)
    router.patch('/:id', controller.patch)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)

    router.patch('/:productId/toggle-status', controller.toggleStatus)

    return router
  }
}
