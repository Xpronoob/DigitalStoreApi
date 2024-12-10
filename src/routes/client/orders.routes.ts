import { Router } from 'express'
import { OrdersDatasource } from '../../datasources/client/orders.datasource'
import { OrdersRepository } from '../../repositories/client/orders.repository'
import { OrdersController } from '../../controllers/client/orders.controller'

export class OrdersClientRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new OrdersDatasource()
    const repository = new OrdersRepository(datasource)

    const controller = new OrdersController(repository)

    router.post('/', controller.create)
    // router.delete('/:id', controller.delete)
    // router.get('/:id', controller.getById)
    // router.get('/', controller.getAll)

    return router
  }
}
