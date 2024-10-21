import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { ProductEntity, ProductEntityOptional } from '../../entities/products.entity'
import { ProductOptionsEntity } from '../../entities/product-options.entity'

const prisma = new PrismaClient()

export class ProductsDatasource {
  async create(productData: ProductEntity) {
    try {
      const product = await prisma.products.create({
        data: {
          category_id: productData.category_id,
          product_name: productData.product_name,
          active: productData.active,
          product_options_id: productData.product_options_id,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          img: productData.img,
        },
      })
      return product
    } catch (error) {
      throw CustomError.internalServer('Error al crear el producto')
    }
  }

  async patch(productId: number, productData: ProductEntityOptional) {
    try {
      const patchProduct = await prisma.products.update({
        where: { product_id: productId },
        data: {
          category_id: productData.category_id,
          product_name: productData.product_name,
          active: productData.active,
          product_options_id: productData.product_options_id,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          img: productData.img,
        },
      })
      return patchProduct
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar el producto')
    }
  }

  async delete(productId: number) {
    try {
      const deletedProduct = await prisma.products.delete({
        where: { product_id: productId },
      })
      return deletedProduct
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar el producto')
    }
  }

  async getAll() {
    try {
      const products = await prisma.products.findMany()
      return products
    } catch (error) {
      throw CustomError.internalServer('Error al obtener los productos')
    }
  }

  async getById(productId: number) {
    try {
      const product = await prisma.products.findUnique({
        where: { product_id: productId },
      })
      if (!product) {
        throw CustomError.notFound('Producto no encontrado')
      }
      return product
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el producto')
    }
  }

  async toggleStatus(productId: number, active: boolean) {
    try {
      const updatedProduct = await prisma.products.update({
        where: { product_id: productId },
        data: {
          active: active,
        },
      })
      return updatedProduct
    } catch (error) {
      throw CustomError.internalServer(`Error al ${active ? 'activar' : 'desactivar'} el producto`)
    }
  }

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
}
