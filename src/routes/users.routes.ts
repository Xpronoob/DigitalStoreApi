import { Router } from "express"
import { UsersDatasource } from "../datasources/users.datasource"
import { UsersRepository } from "../repositories/users.repository"
import { UsersController } from "../controllers/users.controller"

export class UsersRoutes {
  static get routes(): Router{
    const router = Router()

    const datasource = new UsersDatasource()
    const repository = new UsersRepository(datasource)

    const controller = new UsersController(repository)
    
    router.post('/', controller.create)
    router.patch('/:id', controller.update)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)

    router.post('/:userId/roles/:roleId', controller.addRole)
    router.delete('/:userId/roles/:roleId', controller.removeRole)
    router.get('/:userId/roles', controller.getRoles)

    router.patch('/:userId/toggle-status', controller.toggleStatus);

    router.get('/:userId/cartItems', controller.getCartItems)
    router.get('/:userId/orders', controller.getOrders)
    return router
  }
}