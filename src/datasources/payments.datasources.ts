import { PrismaClient } from '@prisma/client'
import { CustomError } from '../errors/custom.error'

const prisma = new PrismaClient()

export class PaymentsDatasource {
  constructor() {}

  async validateItems(cart: any[]) {
    try {
      const updatedItems = await Promise.all(
        // forEach not wait the promises returned into your callback
        cart.map(async (item: any) => {
          const productDetailsData = await prisma.product_details.findFirst({
            where: { product_details_id: item.id },
            select: { product_details_id: true, details_name: true, quantity: true, price: true, active: true },
          })

          if (productDetailsData?.active === false) {
            throw CustomError.notFound('El producto no existe')
          }

          if (!productDetailsData) {
            throw CustomError.notFound('El producto no existe')
          }

          if (item.quantity > productDetailsData?.quantity!) {
            throw CustomError.badRequest('El stock de este producto es insuficiente')
          }

          const updatedItem = {
            product_details_id: productDetailsData?.product_details_id,
            details_name: productDetailsData?.details_name,
            stock: productDetailsData?.quantity || undefined,
            unitPrice: Number(productDetailsData?.price),
            active: productDetailsData?.active,
            quantity: item.quantity,
            totalPrice: Number(productDetailsData?.price) * item.quantity,
            // totalTax: Number(productDetailsData?.tax) || 0,
          }

          return { ...updatedItem }
        }),
      )

      return updatedItems
    } catch (error) {
      throw CustomError.internalServer('Error al crear la orden')
    }
  }
}
