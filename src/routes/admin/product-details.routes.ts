import { Router } from 'express'
import { ProductDetailsController } from '../../controllers/admin/product-details.controller'
import { ProductDetailsDatasource } from '../../datasources/admin/product-details.datasource'
import { ProductDetailsRepository } from '../../repositories/admin/product-details.repository'
import { uploadSingle } from '../../adapters/multer.adapter'
import { processImage } from '../../adapters/sharp.adapter'

export class ProductDetailsAdminRoutes {
  static get routes(): Router {
    const router = Router()

    const datasource = new ProductDetailsDatasource()
    const repository = new ProductDetailsRepository(datasource)

    const controller = new ProductDetailsController(repository)

    router.post('/', uploadSingle('image'), processImage('productDetails'), controller.create)
    router.patch('/:id', uploadSingle('image'), processImage('productDetails'), controller.update)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)

    router.patch('/:productDetailId/toggle-status', controller.toggleStatus)

    return router
  }
}
