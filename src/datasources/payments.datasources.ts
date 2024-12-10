import { PrismaClient } from '@prisma/client'
import { CustomError } from '../errors/custom.error'

const prisma = new PrismaClient()

export class PaymentsDatasource {
  async validateItems(cart: any[]) {
    const validationResults = await Promise.all(
      cart.map(async (item: any) => {
        try {
          const productDetailsData = await prisma.product_details.findFirst({
            where: { product_details_id: item.id },
            select: { product_details_id: true, details_name: true, quantity: true, price: true, active: true },
          })

          if (!productDetailsData || productDetailsData.active === false) {
            return {
              success: false,
              message: 'El producto no existe',
              itemId: item.id,
              itemName: item.details_name,
            }
          }

          if (item.quantity > productDetailsData.quantity!) {
            return {
              success: false,
              message: `Solo existen ${productDetailsData.quantity} unidades de ${productDetailsData.details_name}`,
              itemId: productDetailsData.product_details_id,
              itemName: productDetailsData.details_name,
            }
          }

          const updatedItem = {
            product_details_id: productDetailsData.product_details_id,
            details_name: productDetailsData.details_name,
            stock: productDetailsData.quantity || undefined,
            unitPrice: Number(productDetailsData.price),
            active: productDetailsData.active,
            quantity: item.quantity,
            totalPrice: Number(productDetailsData.price) * item.quantity,
          }

          return {
            success: true,
            data: updatedItem,
          }
        } catch (error) {
          return {
            success: false,
            message: 'Error desconocido al validar el producto',
            itemId: item.id,
          }
        }
      }),
    )

    const errors = validationResults.filter((result) => !result.success)
    const validItems = validationResults.filter((result) => result.success).map((result) => result.data)

    if (errors.length > 0) {
      return { success: false, errors }
    }

    return { success: true, data: validItems }
  }

  async discountStockItems(data: any[]) {
    const validationResults = await Promise.all(
      data.map(async (item) => {
        try {
          //get product stock
          const productStock = await prisma.product_details.findFirst({
            where: { product_details_id: item.product_details_id },
            select: { quantity: true },
          })

          if (!productStock) throw CustomError.internalServer('Error al obtener el stock del producto')

          //discount from stock
          const discountedItem = await prisma.product_details.update({
            where: { product_details_id: item.product_details_id },
            data: { quantity: productStock?.quantity! - item.quantity },
            select: { product_details_id: true, details_name: true, quantity: true },
          })

          if (!productStock) throw CustomError.internalServer('Error al descontar el stock del producto')

          return { success: true, data: discountedItem }
        } catch (error) {
          return {
            success: false,
            message: 'Error desconocido al descontar el stock  del producto',
            itemId: item.product_details_id,
          }
        }
      }),
    )

    const errors = validationResults.filter((result) => !result.success)
    const validItems = validationResults.filter((result) => result.success).map((result) => result.data)

    if (errors.length > 0) {
      return { success: false, errors }
    }

    return { success: true, discountedItems: validItems }
  }
}
