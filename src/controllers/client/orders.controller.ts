import { Request, Response } from 'express'
import { CustomError } from '../../errors/custom.error'
import { OrdersRepository } from '../../repositories/client/orders.repository'
import { ZodOrdersAdapter } from '../../adapters/zod.orders.adapter'

export class OrdersController {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  //todo: if user not exist
  create = async (req: Request, res: Response) => {
    try {
      const { newOrder, newPayment, validatedUserCart, user } = req.body

      const validatedOrder = ZodOrdersAdapter.validateOrder(newOrder)
      if (!validatedOrder) throw CustomError.badRequest('Error al validar el pedido')
      const validatedPayment = ZodOrdersAdapter.validatePayment(newPayment)
      if (!validatedPayment) throw CustomError.badRequest('Error al validar el pago')
      const createdOrder = await this.ordersRepository.create(validatedPayment, user)
      if (!createdOrder) throw CustomError.internalServer('Error al agregar el pedido')
      const createdOrderItems = await this.ordersRepository.createOrderItems(createdOrder.order_id, validatedUserCart)
      if (!createdOrderItems) throw CustomError.internalServer('Error al agregar productos a la orden')
      const createdPayments = await this.ordersRepository.createPayments(createdOrder.order_id, validatedPayment)
      if (!createdPayments) throw CustomError.internalServer('Error al agregar pagos a la orden')
      const clearCart = await this.ordersRepository.clearCart(user.user_id, validatedUserCart)

      //todo: send whatsapp to user (if have phone validation)
      // todo: send email to user (if have email validation)

      return res.status(200).json({ message: 'Order created', order: createdOrder })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }
}
