import { Router } from 'express'
import { CategoriesController } from '../controllers/categories.controller'
import { CategoriesDatasource } from '../datasources/categories.datasource'
import { CategoriesRepository } from '../repositories/categories.repository'

export class CategoriesRoutes {
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
