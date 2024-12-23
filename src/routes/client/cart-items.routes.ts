import { Router } from 'express'
import { CartItemsDatasource } from '../../datasources/client/cart-items.datasource'
import { CartItemsRepository } from '../../repositories/client/cart-items.repository'
import { CartItemsController } from '../../controllers/client/cart-items.controller'

export class CartItemsClientRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new CartItemsDatasource()
    const repository = new CartItemsRepository(datasource)

    const controller = new CartItemsController(repository)

    router.post('/', controller.create)
    router.patch('/:idCartItems', controller.update)
    router.delete('/:idCartItems', controller.delete)
    router.get('/', controller.getAll)
    router.get('/count', controller.getCount)

    return router
  }
}
