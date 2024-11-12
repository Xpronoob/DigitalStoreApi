import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import { CartItemsEntity, CartItemsUpdateEntity } from '../entities/cart-items.entity'

export class ZodCartItemsAdapter {
  static validateCartItems = (cartItems: CartItemsEntity) => {
    const CartItems = z.object({
      user_id: z.number({
        required_error: 'El ID de usuario es requerido',
      }),
      product_details_id: z.number({
        required_error: 'El ID del detalle de producto es requerido',
      }),
      quantity: z
        .number({
          required_error: 'La cantidad es requerida',
        })
        .positive('La cantidad debe ser positiva'),
    })

    try {
      return CartItems.parse(cartItems)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateCartItemsUpdate = (cartItems: CartItemsUpdateEntity) => {
    const CartItems = z.object({
      user_id: z.number({
        required_error: 'El ID de usuario es requerido',
      }),
      // product_details_id: z.number().optional(),
      quantity: z.number().optional(),
    })

    try {
      return CartItems.parse(cartItems)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
