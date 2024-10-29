import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { CartItemsEntity, CartItemsUpdateEntity } from '../../entities/cart-items.entity'

const prisma = new PrismaClient()

export class CartItemsDatasource {
  async create(cartItemData: CartItemsEntity) {
    try {
      const existingCartItem = await prisma.cart_items.findFirst({
        where: {
          user_id: cartItemData.user_id,
          product_detail_id: cartItemData.product_detail_id,
        },
      })

      const productStock = await prisma.product_details.findUnique({
        where: { product_detail_id: cartItemData.product_detail_id },
        select: { quantity: true },
      })

      if (!productStock) {
        throw CustomError.notFound('El producto no existe')
      }

      const totalQuantity = existingCartItem ? existingCartItem?.quantity! + cartItemData.quantity : cartItemData.quantity

      if (totalQuantity > productStock.quantity!) {
        throw CustomError.badRequest('El stock de este producto es insuficiente')
      }

      if (existingCartItem) {
        const updatedCartItem = await prisma.cart_items.update({
          where: { cart_item_id: existingCartItem.cart_item_id },
          data: { quantity: totalQuantity },
        })

        // const productDetailQuantity = productStock.quantity! - totalQuantity

        // await prisma.product_details.update({
        //   where: { product_detail_id: updatedCartItem.product_detail_id },
        //   data: {
        //     quantity: productDetailQuantity,
        //   },
        // })

        return updatedCartItem
      } else {
        const newCartItem = await prisma.cart_items.create({
          data: {
            user_id: cartItemData.user_id,
            product_detail_id: cartItemData.product_detail_id,
            quantity: cartItemData.quantity,
          },
        })

        // const productDetailQuantity = productStock.quantity! - totalQuantity

        // await prisma.product_details.update({
        //   where: { product_detail_id: cartItemData.product_detail_id },
        //   data: {
        //     quantity: productDetailQuantity,
        //   },
        // })
        return newCartItem
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      console.error('Error al agregar al carrito:', error)
      throw CustomError.internalServer('Error al agregar el producto al carrito')
    }
  }

  async update(cartItemId: number, cartItemData: CartItemsUpdateEntity) {
    try {
      const updatedCartItem = await prisma.cart_items.update({
        where: { cart_item_id: cartItemId },
        data: {
          quantity: cartItemData.quantity,
        },
      })
      return updatedCartItem
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar el carrito')
    }
  }

  async delete(cartItemId: number) {
    try {
      const deletedCartItem = await prisma.cart_items.delete({
        where: { cart_item_id: cartItemId },
      })
      return deletedCartItem
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar del carrito')
    }
  }

  async getAll(userId: number) {
    try {
      const cartItems = await prisma.cart_items.findMany({
        where: { user_id: userId },
      })
      return cartItems
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el carrito')
    }
  }

  async getById(cartItemId: number) {
    try {
      const cartItem = await prisma.cart_items.findUnique({
        where: { cart_item_id: cartItemId },
      })
      return cartItem
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el carrito')
    }
  }
}
