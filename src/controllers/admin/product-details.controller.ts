import { Request, Response } from 'express'
import { ProductDetailsRepository } from '../../repositories/admin/product-details.repository'
import { ZodProductDetailsAdapter } from '../../adapters/zod.products-details.adapter'
import { CustomError } from '../../errors/custom.error'
import { envs } from '../../configs/envs.config'

//DI
export class ProductDetailsController {
  constructor(private readonly productDetailsRepository: ProductDetailsRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const requestFile = req.file

      req.body.product_id = parseInt(req.body.product_id)
      req.body.price = parseInt(req.body.price)
      req.body.quantity = parseInt(req.body.quantity)

      if (requestFile) {
        const fileName = requestFile.filename
        req.body.img = `${req.protocol}://${req.get('host')}/uploads/productDetails/${fileName}`
      }

      if (req.body.active === 'true') {
        req.body.active = true
      } else {
        req.body.active = false
      }

      // if (envs.DEBUG_MODE) {
      //   console.log('Req File: ', req.file)
      //   console.log('Req Body: ', req.body)
      // }

      const validatedData = ZodProductDetailsAdapter.validateProductDetail(req.body)
      const productDetail = await this.productDetailsRepository.create(validatedData)
      console.log('Product Detail: ', productDetail)
      if (!productDetail) throw CustomError.internalServer('Error al crear el detalle del producto')

      res.status(201).json({
        message: 'Detalle del producto creado exitosamente',
        productDetail,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const requestFile = req.file
      const productId = parseInt(req.params.id)

      if (req.body.product_id) req.body.product_id = parseInt(req.body.product_id)
      if (req.body.price) req.body.price = parseInt(req.body.price)
      if (req.body.quantity) req.body.quantity = parseInt(req.body.quantity)
      req.body.active = req.body.active === 'true'

      if (requestFile) {
        const fileName = requestFile.filename
        req.body.img = `${req.protocol}://${req.get('host')}/uploads/productDetails/${fileName}`
      }

      // if (envs.DEBUG_MODE) {
      //   console.log('Req File: ', req.file)
      //   console.log('Req Body: ', req.body)
      // }

      const validatedData = ZodProductDetailsAdapter.validateProductDetail(req.body)

      const [updatedProductDetail, oldImage] = await this.productDetailsRepository.update(productId, validatedData)

      if (requestFile && oldImage?.img) {
        const imgFileName = oldImage.img.split('/uploads/productDetails')[1]

        await this.productDetailsRepository.deleteImg(imgFileName)
      }

      if (!updatedProductDetail) {
        throw CustomError.internalServer('Error al actualizar el detalle del producto')
      }

      res.status(200).json({
        message: 'Detalle del producto actualizado exitosamente',
        updatedProductDetail,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const deletedProductDetail = await this.productDetailsRepository.delete(parseInt(req.params.id))
      if (!deletedProductDetail) throw CustomError.internalServer('Error al eliminar el detalle del producto')

      if (deletedProductDetail.img !== null) {
        const imgFileName = deletedProductDetail.img.split('/uploads/productDetails')[1]
        await this.productDetailsRepository.deleteImg(imgFileName)
      }
      res.status(200).json({
        message: 'Detalle del producto eliminado exitosamente',
        deletedProductDetail,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const productDetails = await this.productDetailsRepository.getAll()

      if (!productDetails) throw CustomError.internalServer('No se encontraron detalles de productos')

      res.status(200).json({
        message: 'Detalles de productos obtenidos exitosamente',
        productDetails,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const productDetail = await this.productDetailsRepository.getById(parseInt(req.params.id))
      res.status(200).json(productDetail)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }

  toggleStatus = async (req: Request, res: Response) => {
    try {
      const { productDetailId } = req.params
      const { active } = req.body

      const updatedProductDetail = await this.productDetailsRepository.toggleStatus(parseInt(productDetailId), active)

      if (!updatedProductDetail) throw CustomError.internalServer('Error al actualizar el estado del detalle del producto')

      res.status(200).json({
        message: active ? 'Detalle del producto activado exitosamente' : 'Detalle del producto desactivado exitosamente',
        updatedProductDetail,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }
}
