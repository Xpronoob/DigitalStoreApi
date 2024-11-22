import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomError } from '../errors/custom.error'

const prisma = new PrismaClient()

export class PublicDatasource {
  constructor() {}

  async getAllProducts(req: Request) {
    try {
      const products = await prisma.product_details.findMany({
        where: { active: true },
        select: {
          product_details_id: true,
          product_id: true,
          details_name: true,
          description: true,
          price: true,
          quantity: true,
          color: true,
          size: true,
          storage: true,
          devices: true,
          // img: true,
          products: {
            select: {
              product_id: true,
              product_name: true,
              description: true,
              // price: true,
              // stock: true,
              // img: true,
              categories: {
                select: {
                  category_id: true,
                  category_name: true,
                },
              },
              product_options: {
                select: {
                  product_options_id: true,
                  product_options_name: true,
                  color: true,
                  size: true,
                  storage: true,
                  devices: true,
                },
              },
            },
          },
        },
      })
      return products
    } catch (error) {
      throw CustomError.internalServer('Error al realizar el pago')
    }
  }

  async getProductDetailsById(productId: number) {
    try {
      const product = await prisma.product_details.findFirst({
        where: { product_details_id: productId },
        select: {
          product_details_id: true,
          product_id: true,
          details_name: true,
          description: true,
          price: true,
          quantity: true,
          color: true,
          size: true,
          storage: true,
          devices: true,
          // img: true,
          products: {
            select: {
              product_id: true,
              product_name: true,
              description: true,
              // price: true,
              // stock: true,
              // img: true,
              categories: {
                select: {
                  category_id: true,
                  category_name: true,
                },
              },
              product_options: {
                select: {
                  product_options_id: true,
                  product_options_name: true,
                  color: true,
                  size: true,
                  storage: true,
                  devices: true,
                },
              },
            },
          },
        },
      })
      return product
    } catch (error) {
      throw CustomError.internalServer('Error al realizar el pago')
    }
  }
}
