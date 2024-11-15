import { Router } from 'express'
import { PublicDatasource } from '../datasources/public.datasources'
import { PublicRepository } from '../repositories/public.repository'
import { PublicController } from '../controllers/public.controller'

export class PublicRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new PublicDatasource()
    const repository = new PublicRepository(datasource)

    const controller = new PublicController(repository)
    // router.post('/pay', controller.pay)
    router.get('/getAllProducts', controller.getAllProducts)
    return router
  }
}
