import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { PaymentsPaypalEntityOptional, PaymentsPaypalEntity } from '../../entities/payments-paypal.entity'
import { ValidateCartItemsEntity } from '../../entities/validate-cart-items.entity'
import { UserEntityOptional } from '../../entities/user.entity'

const prisma = new PrismaClient()

export class OrdersDatasource {
  async create(paymentData: PaymentsPaypalEntityOptional, user: UserEntityOptional) {
    try {
      const userInfo = await prisma.users.findFirst({
        where: { user_id: user.user_id },
        select: {
          user_id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone_number: true,
          addresses: {
            where: {
              default_address: true,
            },
            select: {
              address_id: true,
              street: true,
              city: true,
              state: true,
              postal_code: true,
              country: true,
            },
          },
        },
      })

      const defaultAddress = userInfo?.addresses?.[0]

      const createdOrder = await prisma.orders.create({
        data: {
          user_id: userInfo?.user_id!,
          address_id: defaultAddress?.address_id,
          email: userInfo?.email!,
          first_name: userInfo?.first_name,
          last_name: userInfo?.last_name,
          phone_number: userInfo?.phone_number,
          street: defaultAddress?.street! || '',
          city: defaultAddress?.city! || '',
          state: defaultAddress?.state || '',
          postal_code: defaultAddress?.postal_code! || '',
          country: defaultAddress?.country! || '',
          total_amount: paymentData.total_amount!,
          payment_fee: paymentData.payment_fee!,
          net_amount: paymentData.net_amount!,
          tracking_code: `${paymentData.payment_paypal_id}WW`,
          status: 'paid',
          order_date: new Date(),
        },
      })

      return createdOrder
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      console.error('Error al agregar al carrito:', error)
      throw CustomError.internalServer('Error al agregar el producto al carrito')
    }
  }

  async createOrdersItems(orderId: number, cart: ValidateCartItemsEntity[]) {
    try {
      // const products = await prisma.product_details.findMany({
      //   where: {
      //     product_details_id: {
      //       in: cart.map((item) => item.product_details_id),
      //     },
      //   },
      // })

      const products = await Promise.all(
        cart.map(async (item) => {
          try {
            const product = await prisma.product_details.findFirst({
              where: {
                product_details_id: item.product_details_id,
              },
            })

            return { ...product, stock: item.quantity }
          } catch (error) {
            console.error('Error al agregar productos a la orden:', error)
            throw CustomError.internalServer('Error al agregar productos a la orden')
          }
        }),
      )

      const orderItems = await Promise.all(
        products.map(async (item) => {
          try {
            const orderItem = await prisma.order_items.create({
              data: {
                order_id: orderId,
                product_id: item?.product_details_id!,
                product_details_id: item?.product_details_id!,
                details_name: item?.details_name!,
                quantity: item?.quantity!,
                stock: item?.stock!,
                product_name: item?.details_name,
                description: item?.details_name,
                price: item?.price!,
                color: item?.color,
                size: item?.size,
                storage: item?.storage,
                devices: item?.devices,
                img: item?.img,
                discount: item?.discount,
                tax: item?.tax,
              },
            })

            if (!orderItem) throw CustomError.internalServer('Error al agregar productos a la orden')

            return orderItem
          } catch (error) {
            console.error('Error al agregar productos a la orden:', error)
            throw CustomError.internalServer('Error al agregar productos a la orden')
          }
        }),
      )

      return orderItems
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      console.error('Error al agregar agregar productos a la orden:', error)
      throw CustomError.internalServer('Error al agregar productos a la orden')
    }
  }

  async createPayments(orderId: number, payments: PaymentsPaypalEntity) {
    try {
      const order = await prisma.orders.findFirst({
        where: { order_id: orderId },
        select: { order_id: true },
      })

      if (!order) throw CustomError.internalServer('Error al obtener la orden')

      const payment = await prisma.payments.create({
        data: {
          order_id: order.order_id,
          payment_method: 'paypal',
          payment_paypal_id: payments.payment_paypal_id,
          payment_capture_id: payments.payment_capture_id,
          payment_payer_id: payments.payment_payer_id,
          payment_email_address: payments.payment_email_address,
          payment_first_name: payments.payment_first_name,
          payment_last_name: payments.payment_last_name,
          address_line_1: payments.address_line_1,
          address_line_2: payments.address_line_2,
          admin_area_1: payments.admin_area_1,
          admin_area_2: payments.admin_area_2,
          postal_code: payments.postal_code,
          country: payments.country,
          total_amount: payments.total_amount,
          payment_fee: payments.payment_fee,
          net_amount: payments.net_amount,
          payment_status: payments.payment_status,
          payment_date: payments.payment_date,
        },
      })

      if (!payment) throw CustomError.internalServer('Error al agregar pagos a la orden')

      return payment
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      console.error('Error al agregar pagos a la orden:', error)
      throw CustomError.internalServer('Error al agregar pagos a la orden')
    }
  }

  async clearCart(userId: number, cart: ValidateCartItemsEntity[]) {
    try {
      await Promise.all(
        cart.map(async (item) => {
          await prisma.cart_items.deleteMany({
            where: {
              user_id: userId,
              product_details_id: item.product_details_id,
            },
          })
        }),
      )
    } catch (error) {
      console.error('Error al eliminar del carrito:', error)
      throw CustomError.internalServer('Error al eliminar del carrito')
    }
  }
}
