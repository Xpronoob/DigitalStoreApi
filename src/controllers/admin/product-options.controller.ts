import { Request, Response } from 'express'
import { ZodProductsAdapter } from '../../adapters/zod.products.adapter'
import { CustomError } from '../../errors/custom.error'
import { ProductOptionsRepository } from '../../repositories/admin/product-options.repository'

// DI
export class ProductOptionsController {
  constructor(private readonly productsRepository: ProductOptionsRepository) {}

  createOptions = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodProductsAdapter.validateProductOptions(req.body)
      if (!validatedData) throw CustomError.badRequest('Error al validar los datos enviados')

      const productOptions = await this.productsRepository.createOptions(validatedData)
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

  updateOptions = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodProductsAdapter.validateProductOptions(req.body)
      const updatedProductOptions = await this.productsRepository.updateOptions(parseInt(req.params.productOptionsId), validatedData)

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

  toggleStatusProductOptions = async (req: Request, res: Response) => {
    try {
      const { productOptionsId } = req.params
      const { active } = req.body

      const updatedProduct = await this.productsRepository.toggleStatusProductOptions(parseInt(productOptionsId), active)

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

  productOptionGetAll = async (req: Request, res: Response) => {
    try {
      const products = await this.productsRepository.productOptionGetAll()

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

  productOptionGetById = async (req: Request, res: Response) => {
    try {
      const product = await this.productsRepository.productOptionGetById(parseInt(req.params.productOptionsId))

      if (!product) throw CustomError.notFound('Tipo de producto no encontrado')

      res.status(200).json({
        message: 'Tipo de producto obtenido exitosamente',
        product,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }
}
