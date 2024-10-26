import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { CartItemsEntity, CartItemsUpdateEntity } from '../../entities/cart-items.entity'

const prisma = new PrismaClient()

export class CartItemsDatasource {
  async create(cartItemData: CartItemsEntity) {
    try {
      const existCartItem = await prisma.cart_items.findFirst({
        where: { user_id: cartItemData.user_id, product_detail_id: cartItemData.product_detail_id },
      })

      if (existCartItem?.quantity != null) {
        const updatedCartItem = await prisma.cart_items.update({
          where: {
            cart_item_id: existCartItem.cart_item_id,
          },
          data: {
            quantity: cartItemData.quantity || existCartItem.quantity + 1,
          },
        })
        return updatedCartItem
      } else {
        const cartItem = await prisma.cart_items.create({
          data: {
            user_id: cartItemData.user_id,
            product_detail_id: cartItemData.product_detail_id,
            quantity: cartItemData.quantity,
          },
        })
        return cartItem
      }
    } catch (error) {
      throw CustomError.internalServer('Error al insertan en el carrito')
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
