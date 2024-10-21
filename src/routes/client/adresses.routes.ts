import { Router } from 'express'
import { AuthMiddleware } from '../../middlewares/auth.middleware'
import { AddressesController } from '../../controllers/client/adresses.controller'
import { AddressesDatasource } from '../../datasources/client/adresses.datasource'
import { AddressesRepository } from '../../repositories/client/adresses.repository'

export class AddressesClientRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new AddressesDatasource()
    const repository = new AddressesRepository(datasource)

    const controller = new AddressesController(repository)

    router.use(AuthMiddleware.authorization)

    router.post('/', controller.create)
    router.patch('/:id', controller.update)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)
    router.patch('/:id/set-default', controller.setDefault)

    return router
  }
}
