import { Router } from "express"
import { RolesRepository } from "../repositories/roles.repository"
import { RolesDatasource } from "../datasources/roles.datasource"
import { RolesController } from "../controllers/roles.controller"
import { AuthMiddleware } from '../middlewares/auth.middleware'

export class RolesRoutes {
  static get routes(): Router{
    const router = Router()

    const datasource = new RolesDatasource()
    const repository = new RolesRepository(datasource)

    const controller = new RolesController(repository)
    
    router.post('/roles', controller.create)
    router.patch('/roles/:id', controller.update)
    router.delete('/roles/:id', controller.delete)
    router.get('/roles/:id', controller.getById)
    router.get('/roles', controller.getAll)

    return router
  }
}