import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { ProductDetailsEntity, ProductDetailsEntityOptional } from '../../entities/product-details'

const prisma = new PrismaClient()

export class ProductDetailsDatasource {
  async create(productDetailData: ProductDetailsEntity) {
    try {
      const productDetail = await prisma.product_details.create({
        data: {
          product_id: productDetailData.product_id,
          details_name: productDetailData.details_name,
          description: productDetailData.description,
          price: productDetailData.price,
          quantity: productDetailData.quantity,
          color: productDetailData.color,
          size: productDetailData.size,
          storage: productDetailData.storage,
          devices: productDetailData.devices,
          img: productDetailData.img,
          active: productDetailData.active,
        },
      })
      return productDetail
    } catch (error) {
      throw CustomError.internalServer('Error al crear el detalle del producto')
    }
  }

  async update(productDetailId: number, productDetailsData: ProductDetailsEntityOptional) {
    try {
      let oldImage = null
      if (productDetailsData.img) {
        oldImage = await prisma.product_details.findFirst({
          where: { product_details_id: productDetailId },
          select: { img: true },
        })
      }

      const updatedProductDetails = await prisma.product_details.update({
        where: { product_details_id: productDetailId },
        data: productDetailsData,
      })

      return [updatedProductDetails, oldImage]
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar el detalle del producto')
    }
  }

  async delete(productDetailId: number) {
    try {
      const deletedProductDetail = await prisma.product_details.delete({
        where: { product_details_id: productDetailId },
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
        where: { product_details_id: productDetailId },
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
        where: { product_details_id: productDetailId },
        data: {
          active: active,
        },
      })
      return updatedProductDetail
    } catch (error) {
      throw CustomError.internalServer(`Error al ${active ? 'activar' : 'desactivar'} el detalle del producto`)
    }
  }

  async deleteImg(imgFileName: string) {
    try {
      const fs = require('fs')
      const path = require('path')

      const filePath = path.join(__dirname, '../../../uploads/productDetails', imgFileName)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error('Error al eliminar la imagen:', error)
      throw CustomError.internalServer('Error al eliminar la imagen del detalle del producto')
    }
  }
}
