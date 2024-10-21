import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { ProductDetailEntity, ProductDetailEntityOptional } from '../../entities/product-details'

const prisma = new PrismaClient()

export class ProductDetailsDatasource {
  async create(productDetailData: ProductDetailEntity) {
    try {
      const productDetail = await prisma.product_details.create({
        data: {
          product_id: productDetailData.product_id,
          detail_name: productDetailData.detail_name,
          description: productDetailData.description,
          price: productDetailData.price,
          quantity: productDetailData.quantity,
          color: productDetailData.color,
          size: productDetailData.size,
          storage: productDetailData.storage,
          devices: productDetailData.devices,
          active: productDetailData.active,
        },
      })
      return productDetail
    } catch (error) {
      throw CustomError.internalServer('Error al crear el detalle del producto')
    }
  }

  async update(productDetailId: number, productDetailData: ProductDetailEntityOptional) {
    try {
      const updatedProductDetail = await prisma.product_details.update({
        where: { product_detail_id: productDetailId },
        data: {
          detail_name: productDetailData.detail_name,
          description: productDetailData.description,
          price: productDetailData.price,
          quantity: productDetailData.quantity,
          color: productDetailData.color,
          size: productDetailData.size,
          storage: productDetailData.storage,
          devices: productDetailData.devices,
          active: productDetailData.active,
        },
      })
      return updatedProductDetail
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar el detalle del producto')
    }
  }

  async delete(productDetailId: number) {
    try {
      const deletedProductDetail = await prisma.product_details.delete({
        where: { product_detail_id: productDetailId },
      })
      return deletedProductDetail
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar el detalle del producto')
    }
  }

  async getAll() {
    try {
      const productDetails = await prisma.product_details.findMany()
      return productDetails
    } catch (error) {
      throw CustomError.internalServer('Error al obtener los detalles de los productos')
    }
  }

  async getById(productDetailId: number) {
    try {
      const productDetail = await prisma.product_details.findUnique({
        where: { product_detail_id: productDetailId },
      })
      if (!productDetail) {
        throw CustomError.notFound('Detalle del producto no encontrado')
      }
      return productDetail
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el detalle del producto')
    }
  }

  async toggleStatus(productDetailId: number, active: boolean) {
    try {
      const updatedProductDetail = await prisma.product_details.update({
        where: { product_detail_id: productDetailId },
        data: {
          active: active,
        },
      })
      return updatedProductDetail
    } catch (error) {
      throw CustomError.internalServer(`Error al ${active ? 'activar' : 'desactivar'} el detalle del producto`)
    }
  }
}
