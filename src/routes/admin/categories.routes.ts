import { Router } from 'express'
import { CategoriesDatasource } from '../../datasources/admin/categories.datasource'
import { CategoriesRepository } from '../../repositories/admin'
import { CategoriesController } from '../../controllers/admin'

export class CategoriesAdminRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new CategoriesDatasource()
    const repository = new CategoriesRepository(datasource)

    const controller = new CategoriesController(repository)

    router.post('/', controller.create)
    router.patch('/:id', controller.update)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)

    router.patch('/:categoryId/toggle-status', controller.toggleStatus)

    return router
  }
}
