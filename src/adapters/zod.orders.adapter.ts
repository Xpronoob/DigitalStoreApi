import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import { OrdersEntityOptional } from '../entities/orders.entity'
import { PaymentsPaypalEntity, PaymentsPaypalEntityOptional } from '../entities/payments-paypal.entity'

export class ZodOrdersAdapter {
  static validateOrder = (order: OrdersEntityOptional) => {
    const Order = z.object({
      total_amount: z.number({ required_error: 'El campo total_amount es obligatorio' }),
      payment_fee: z.number({ required_error: 'El campo payment_fee es obligatorio' }),
      net_amount: z.number({ required_error: 'El campo net_amount es obligatorio' }),
      status: z.string({ required_error: 'El campo status es obligatorio' }),
      order_date: z.string({ required_error: 'El campo order_date es obligatorio' }),
    })

    try {
      return Order.parse(order)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Error al validar el orden:', error)
        throw CustomError.badRequest(error.errors[0].message)
      }
      console.error('Error al validar el orden:', error)
      throw CustomError.internalServer()
    }
  }

  static validatePayment = (payment: PaymentsPaypalEntity) => {
    const Payment = z.object({
      payment_method: z.string({ required_error: 'El campo payment_method es obligatorio' }),
      payment_paypal_id: z.string({ required_error: 'El campo payment_paypal_id es obligatorio' }),
      payment_capture_id: z.string({ required_error: 'El campo payment_capture_id es obligatorio' }),
      payment_payer_id: z.string({ required_error: 'El campo payment_payer_id es obligatorio' }),
      payment_email_address: z.string({ required_error: 'El campo payment_email_address es obligatorio' }),
      payment_first_name: z.string({ required_error: 'El campo payment_first_name es obligatorio' }),
      payment_last_name: z.string({ required_error: 'El campo payment_last_name es obligatorio' }),
      address_line_1: z.string({ required_error: 'El campo address_line_1 es obligatorio' }),
      address_line_2: z.string({ required_error: 'El campo address_line_2 es obligatorio' }),
      admin_area_1: z.string({ required_error: 'El campo admin_area_1 es obligatorio' }),
      admin_area_2: z.string({ required_error: 'El campo admin_area_2 es obligatorio' }),
      postal_code: z.string({ required_error: 'El campo postal_code es obligatorio' }),
      country: z.string({ required_error: 'El campo country es obligatorio' }),
      total_amount: z.number({ required_error: 'El campo total_amount es obligatorio' }),
      payment_fee: z.number({ required_error: 'El campo payment_fee es obligatorio' }),
      net_amount: z.number({ required_error: 'El campo net_amount es obligatorio' }),
      payment_status: z.string({ required_error: 'El campo payment_status es obligatorio' }),
      payment_date: z.string({ required_error: 'El campo payment_date es obligatorio' }),
    })

    try {
      return Payment.parse(payment)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
