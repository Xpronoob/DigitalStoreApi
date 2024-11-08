import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { ProductEntity, ProductEntityOptional } from '../../entities/products.entity'
import { ProductOptionsEntity } from '../../entities/product-options.entity'

const prisma = new PrismaClient()

export class ProductOptionsDatasource {
  async createOptions(productOptionsData: ProductOptionsEntity) {
    try {
      if (!productOptionsData.product_options_name) {
        throw CustomError.badRequest('Error al validar los datos enviados')
      }
      const { product_options_name, active, color, size, storage, devices } = productOptionsData
      const product = await prisma.product_options.create({
        data: {
          product_options_name,
          active,
          color,
          size,
          storage,
          devices,
        },
      })
      return product
    } catch (error) {
      throw CustomError.internalServer('Error al configurar las opciones del producto')
    }
  }

  async updateOptions(productOptionsId: number, productOptionsData: ProductOptionsEntity) {
    try {
      const { product_options_name, active, color, size, storage, devices } = productOptionsData
      const product = await prisma.product_options.update({
        where: { product_options_id: productOptionsId },
        data: {
          product_options_name,
          active,
          color,
          size,
          storage,
          devices,
        },
      })
      return product
    } catch (error) {
      throw CustomError.internalServer('Error al configurar las opciones del producto')
    }
  }

  async toggleStatusProductOptions(productOptionsId: number, active: boolean) {
    try {
      const updatedProduct = await prisma.product_options.update({
        where: { product_options_id: productOptionsId },
        data: {
          active: active,
        },
      })
      return updatedProduct
    } catch (error) {
      throw CustomError.internalServer(`Error al ${active ? 'activar' : 'desactivar'} el producto`)
    }
  }

  async productOptionGetById(productOptionsId: number) {
    try {
      const product = await prisma.product_options.findUnique({
        where: { product_options_id: productOptionsId },
      })
      if (!product) {
        throw CustomError.notFound('Tipo del producto no encontrado')
      }
      return product
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el tipo del producto')
    }
  }

  async productOptionGetAll() {
    try {
      const products = await prisma.product_options.findMany()
      return products
    } catch (error) {
      throw CustomError.internalServer('Error al obtener los tipos de productos')
    }
  }
}
