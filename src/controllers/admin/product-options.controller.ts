import { Request, Response } from 'express'
import { ZodProductsAdapter } from '../../adapters/zod.products.adapter'
import { CustomError } from '../../errors/custom.error'
import { ProductOptionsRepository } from '../../repositories/admin/product-options.repository'

// DI
export class ProductOptionsController {
  constructor(private readonly productOptionsRepository: ProductOptionsRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodProductsAdapter.validateProductOptions(req.body)
      if (!validatedData) throw CustomError.badRequest('Error al validar los datos enviados')

      const productOptions = await this.productOptionsRepository.create(validatedData)
      if (!productOptions) throw CustomError.internalServer('Error al crear las opciones del producto')

      res.status(201).json({
        message: 'Opciones del producto creadas exitosamente',
        productOptions,
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
      const validatedData = ZodProductsAdapter.validateProductOptions(req.body)
      const updatedProductOptions = await this.productOptionsRepository.update(parseInt(req.params.productOptionsId), validatedData)

      if (!updatedProductOptions) throw CustomError.internalServer('Error al actualizar las opciones del producto')

      res.status(200).json({
        message: 'Opciones del producto actualizadas exitosamente',
        updatedProductOptions,
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
      const deletedProduct = await this.productOptionsRepository.delete(parseInt(req.params.productOptionsId))

      if (!deletedProduct) throw CustomError.internalServer('Error al eliminar el tipo de producto')

      res.status(200).json({
        message: 'Tipo de producto eliminado exitosamente',
        deletedProduct,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  toggleStatus = async (req: Request, res: Response) => {
    try {
      const { productOptionsId } = req.params
      const { active } = req.body

      const updatedProduct = await this.productOptionsRepository.toggleStatus(parseInt(productOptionsId), active)

      if (!updatedProduct) throw CustomError.internalServer('Error al actualizar el estado del producto')

      res.status(200).json({
        message: active ? 'Producto activado exitosamente' : 'Producto desactivado exitosamente',
        updatedProduct,
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
      const products = await this.productOptionsRepository.getAll()

      if (!products) throw CustomError.internalServer('No se encontraron los tipos de productos')

      res.status(200).json({
        message: 'Tipos de productos obtenidos exitosamente',
        products,
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
      const product = await this.productOptionsRepository.getById(parseInt(req.params.productOptionsId))

      if (!product) throw CustomError.notFound('Tipo de producto no encontrado')

      res.status(200).json(product)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }
}
