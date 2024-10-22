import { Router } from 'express'
import { LicensesController } from '../../controllers/admin/licenses.controller'
import { LicensesDatasource } from '../../datasources/admin/licenses.datasource'
import { LicensesRepository } from '../../repositories/admin/licenses.repository'

export class LicensesAdminRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new LicensesDatasource()
    const repository = new LicensesRepository(datasource)
    const controller = new LicensesController(repository)

    router.post('/', controller.create)
    router.patch('/:id', controller.update)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)
    router.patch('/:licenseId/toggle-status', controller.toggleStatus)

    return router
  }
}
