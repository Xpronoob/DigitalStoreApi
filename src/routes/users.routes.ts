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
    
    router.post('/users', controller.create)
    router.patch('/users/:id', controller.update)
    router.delete('/users/:id', controller.delete)
    router.get('/users/:id', controller.getById)
    router.get('/users', controller.getAll)

    return router
  }
}