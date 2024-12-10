import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { ProductEntity, ProductEntityOptional } from '../../entities/products.entity'
import { ProductOptionsEntity } from '../../entities/product-options.entity'

const prisma = new PrismaClient()

export class ProductOptionsDatasource {
  async create(productOptionsData: ProductOptionsEntity) {
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

  async update(productOptionsId: number, productOptionsData: ProductOptionsEntity) {
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

  async toggleStatus(productOptionsId: number, active: boolean) {
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

  async getById(productOptionsId: number) {
    try {
      const product = await prisma.product_options.findUnique({
        where: { product_options_id: productOptionsId },
      })
      if (!product) {
        throw CustomError.notFound('Tipo del producto no encontrado')
      }

      const productResponse = {
        product_options_id: product.product_options_id,
        product_options_name: product.product_options_name,
        active: product.active,
        color: product.color,
        size: product.size,
        storage: product.storage,
        devices: product.devices,
      }

      return product
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el tipo del producto')
    }
  }

  async getAll() {
    try {
      const products = await prisma.product_options.findMany()
      return products
    } catch (error) {
      throw CustomError.internalServer('Error al obtener los tipos de productos')
    }
  }

  async delete(productOptionsId: number) {
    try {
      const product = await prisma.product_options.findUnique({
        where: { product_options_id: productOptionsId },
      })

      if (!product) {
        throw CustomError.notFound('Tipo de producto no encontrado')
      }

      const deleteProductOptions = await prisma.product_options.delete({
        where: { product_options_id: productOptionsId },
      })

      return deleteProductOptions
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar el tipo del producto')
    }
  }
}
