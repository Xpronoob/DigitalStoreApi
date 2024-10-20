import { Router } from 'express'
import { RolesRepository } from '../../repositories/admin/roles.repository'
import { RolesDatasource } from '../../datasources/admin/roles.datasource'
import { RolesController } from '../../controllers/admin/roles.controller'

export class RolesAdminRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new RolesDatasource()
    const repository = new RolesRepository(datasource)

    const controller = new RolesController(repository)

    router.post('/', controller.create)
    router.patch('/:id', controller.update)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)

    return router
  }
}
