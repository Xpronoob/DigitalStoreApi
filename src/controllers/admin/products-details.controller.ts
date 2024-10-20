import { Request, Response } from 'express'
import { ProductDetailsRepository } from '../../repositories/admin/products-details.repository'
import { ZodProductDetailsAdapter } from '../../adapters/zod.products-details.adapter'
import { CustomError } from '../../errors/custom.error'

//DI
export class ProductDetailsController {
  constructor(private readonly productDetailsRepository: ProductDetailsRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodProductDetailsAdapter.validateProductDetail(req.body)
      const productDetail = await this.productDetailsRepository.create(validatedData)

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
      const validatedData = ZodProductDetailsAdapter.validateProductDetail(req.body)
      const updatedProductDetail = await this.productDetailsRepository.update(parseInt(req.params.id), validatedData)

      if (!updatedProductDetail) throw CustomError.internalServer('Error al actualizar el detalle del producto')

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
