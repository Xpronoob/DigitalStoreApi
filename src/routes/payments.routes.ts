import { Router } from 'express'
import { PaymentsDatasource } from '../datasources/payments.datasources'
import { PaymentsRepository } from '../repositories/payments.repository'
import { PaymentsController } from '../controllers/payments.controller'

export class PaymentsRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new PaymentsDatasource()
    const repository = new PaymentsRepository(datasource)

    const controller = new PaymentsController(repository)
    router.post('/orders', controller.createOrder)
    router.post('/orders/:orderID/capture', controller.captureOrder)
    return router
  }
}
