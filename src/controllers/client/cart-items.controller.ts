import { Request, Response } from 'express'
import { CustomError } from '../../errors/custom.error'
import { CartItemsRepository } from '../../repositories/client/cart-items.repository'
import { ZodCartItemsAdapter } from '../../adapters/zod.cart-items.adapter'

export class CartItemsController {
  constructor(private readonly cartItemsRepository: CartItemsRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const validatedData = ZodCartItemsAdapter.validateCartItems({
        ...req.body,
        user_id: user.user_id,
      })

      const cartItem = await this.cartItemsRepository.create(validatedData)
      if (!cartItem) throw CustomError.internalServer('Error al agregar al carrito')

      res.status(201).json({
        message: 'Agregado al carrito exitosamente',
        cartItem,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const userId = user.user_id

      const validatedData = ZodCartItemsAdapter.validateCartItemsUpdate({ ...req.body, user_id: userId })

      const existingCartItem = await this.cartItemsRepository.getById(parseInt(req.params.idCartItem))

      if (!existingCartItem) {
        throw CustomError.notFound('El ítem no existe en el carrito')
      }

      if (existingCartItem.user_id !== userId) {
        throw CustomError.forbidden('No tienes permiso para modificar este ítem')
      }

      const updatedCartItem = await this.cartItemsRepository.update(parseInt(req.params.idCartItem), validatedData)

      if (!updatedCartItem) throw CustomError.internalServer('Error al actualizar el carrito')

      res.status(200).json({
        message: 'Carrito actualizado exitosamente',
        updatedCartItem,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const userId = user.user_id

      const existingCartItem = await this.cartItemsRepository.getById(parseInt(req.params.idCartItem))

      if (!existingCartItem) {
        throw CustomError.notFound('El ítem no existe en el carrito')
      }

      if (existingCartItem.user_id !== userId) {
        throw CustomError.forbidden('No tienes permiso para eliminar este ítem')
      }

      const deletedCartItem = await this.cartItemsRepository.delete(parseInt(req.params.idCartItem))

      if (!deletedCartItem) throw CustomError.internalServer('Error al eliminar del carrito')

      res.status(200).json({
        message: 'Eliminado exitosamente del carrito',
        deletedCartItem,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const cartItems = await this.cartItemsRepository.getAll(user.user_id)
      if (!cartItems) throw CustomError.internalServer('No se encontraron artículos en el carrito')

      res.status(200).json({
        message: 'Carrito obtenido exitosamente',
        cartItems,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  // todo: checkout
  checkout = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const cartItems = await this.cartItemsRepository.getAll(user.user_id)
      if (!cartItems) throw CustomError.internalServer('No se artículos en el carrito')

      res.status(200).json({
        message: 'Carrito obtenido exitosamente',
        cartItems,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }
}
