import { Request, Response } from 'express'
import { CustomError } from '../errors/custom.error'
import { PaymentsRepository } from '../repositories/payments.repository'
import { ApiError, CheckoutPaymentIntent, Client, Environment, LogLevel, OrdersController } from '@paypal/paypal-server-sdk'
import { envs, parseToString } from '../configs/envs.config'
import { PaypalBodyEntity } from '../entities/paypal-body.entity'
import { OrdersEntityOptional } from '../entities/orders.entity'
import { PaymentsPaypalEntityOptional } from '../entities/payments-paypal.entity'

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: envs.PAYPAL_CLIENT_ID,
    oAuthClientSecret: envs.PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
})

const ordersController = new OrdersController(client)

const buildOrderPayload = (items: any[], totals: any) => ({
  body: {
    intent: CheckoutPaymentIntent.Capture,
    purchaseUnits: [
      {
        referenceId: '1',
        amount: {
          currencyCode: 'USD',
          value: totals.totalAmount,
          breakdown: {
            itemTotal: { currencyCode: 'USD', value: totals.itemTotal },
            shipping: { currencyCode: 'USD', value: totals.shipping },
            handling: { currencyCode: 'USD', value: totals.handling },
            taxTotal: { currencyCode: 'USD', value: totals.taxTotal },
          },
        },
        items,
      },
    ],
  },
  prefer: 'return=minimal',
})

const calculateOrderTotals = (items: any[]) => {
  let itemTotal = 0
  let shipping = 0
  let handling = 0
  let taxTotal = 0

  items.forEach((item) => {
    itemTotal += item.totalPrice
    // taxTotal += item.totalTax;
  })

  let totalAmount = itemTotal + shipping + handling + taxTotal

  return {
    itemTotal: itemTotal.toString(),
    shipping: shipping.toString(),
    handling: handling.toString(),
    taxTotal: taxTotal.toString(),
    totalAmount: totalAmount.toString(),
  }
}

const mapItems = (items: any[]) =>
  items.map((item) => ({
    name: item.details_name,
    quantity: parseToString(item.quantity),
    description: item.details_name,
    unitAmount: {
      currencyCode: 'USD',
      value: parseToString(item.unitPrice),
    },
    tax: { currencyCode: 'USD', value: '0' },
  }))

const createOrder = async (cart: any) => {
  try {
    const { body, ...httpResponse } = await ordersController.ordersCreate(cart)
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body as string),
      httpStatusCode: httpResponse.statusCode,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.log('error', error)
      throw new Error(error.message)
    }
    console.log('error', error)
    throw new Error('Unexpected error occurred while creating the order.')
  }
}

const captureOrder = async (orderID: string) => {
  const collect = {
    id: orderID,
    prefer: 'return=minimal',
  }

  try {
    const { body, ...httpResponse } = await ordersController.ordersCapture(collect)
    // Get more response info...
    // const { statusCode, headers } = httpResponse;

    const parsedBody: PaypalBodyEntity = typeof body === 'string' ? JSON.parse(body) : body

    return {
      jsonResponse: JSON.parse(body as string),
      httpStatusCode: httpResponse.statusCode,
      body: parsedBody,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message)
    }
    throw new Error('Unexpected error occurred while creating the order.')
  }
}

export class PaymentsController {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  createOrder = async (req: Request, res: Response) => {
    try {
      const { cart } = req.body
      const { success, data, errors } = await this.paymentsRepository.validateItems(cart)

      if (success === false) {
        let errorsArray: any[] = []
        errors?.map((error) => {
          errorsArray.push(error.message)
        })

        return res.status(400).json(errorsArray)
      }

      const mappedItems = mapItems(data!)
      const totals = calculateOrderTotals(data!)
      const orderPayload = buildOrderPayload(mappedItems, totals)

      const { jsonResponse, httpStatusCode } = await createOrder(orderPayload)
      res.status(httpStatusCode).json(jsonResponse)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      console.error('Error in createOrder:', error)
      res.status(500).json({ error: 'Failed to create order.' })
    }
  }

  captureOrder = async (req: Request, res: Response) => {
    try {
      const { cart } = req.body

      //data = updated cart (stock...etc)
      const { success, data, errors } = await this.paymentsRepository.validateItems(cart)

      if (success === false) {
        let errorsArray: any[] = []
        errors?.map((error) => {
          errorsArray.push(error.message)
        })

        console.log('errorsArray', errorsArray)
        return res.status(400).json(errorsArray)
      }

      const { orderID } = req.params

      //body = paypal data
      const { jsonResponse, httpStatusCode, body } = await captureOrder(orderID)

      if (!body || typeof body !== 'object') {
        throw new CustomError(500, 'Invalid response from PayPal')
      }

      if (httpStatusCode !== 201) throw new CustomError(httpStatusCode, 'Error al capturar el pago, vuelve a intentarlo.')

      // todo: discount stock items from DB
      const { success: successDiscount, discountedItems, errors: errorsDiscount } = await this.paymentsRepository.discountStockItems(data)

      if (successDiscount === false) {
        let errorsArray: any[] = []
        errors?.map((error) => {
          errorsArray.push(error.message)
        })

        console.log('errorsArray', errorsArray)
        return res.status(400).json(errorsArray)
      }

      //todo: Map cart and orders

      const paypalMap = (body: PaypalBodyEntity) => {
        let newOrder: OrdersEntityOptional = {
          total_amount: parseInt(body.purchase_units[0].payments.captures[0].amount.value),
          payment_fee: parseInt(body.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value),
          net_amount: parseInt(body.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.value),
          status: body.purchase_units[0].payments.captures[0].status,
          order_date: new Date(),
        }

        let newPayment: PaymentsPaypalEntityOptional = {
          payment_method: 'paypal',
          payment_paypal_id: body.id,
          payment_capture_id: body.purchase_units[0].payments.captures[0].id,
          payment_payer_id: body.payer.payer_id,
          payment_email_address: body.payer.email_address,
          payment_first_name: body.payer.name.given_name,
          payment_last_name: body.payer.name.surname,
          address_line_1: body.purchase_units[0].shipping.address.address_line_1,
          address_line_2: body.purchase_units[0].shipping.address.address_line_2,
          admin_area_1: body.purchase_units[0].shipping.address.admin_area_1,
          admin_area_2: body.purchase_units[0].shipping.address.admin_area_2,
          postal_code: body.purchase_units[0].shipping.address.postal_code,
          country: body.purchase_units[0].shipping.address.country_code,
          total_amount: parseInt(body.purchase_units[0].payments.captures[0].amount.value),
          payment_fee: parseInt(body.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value),
          net_amount: parseInt(body.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.value),
          payment_status: body.purchase_units[0].payments.captures[0].status,
          payment_date: new Date(),
        }

        return [newOrder, newPayment]
      }

      const [newOrder, newPayment] = paypalMap(body as PaypalBodyEntity)

      if (req.body.user.user_id) {
        const itemUpdated = await fetch('http://localhost:3030/api/client/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${req.body.user.accessToken}`,
            'X-Refresh-Token': req.body.user.refreshToken,
          },
          body: JSON.stringify({
            newOrder: newOrder,
            newPayment: newPayment,
            validatedUserCart: data,
          }),
        })

        if (!itemUpdated.ok) {
          throw new Error(`Error en la solicitud: ${itemUpdated.status} - ${itemUpdated.statusText}`)
        }

        const itemData = await itemUpdated.json()

        res.status(httpStatusCode).json(itemData)
      } else {
        const itemUpdated = await fetch('http://localhost:3030/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newOrder: newOrder,
            newPayment: newPayment,
            validatedUserCart: data,
          }),
        })

        if (!itemUpdated.ok) {
          throw new Error(`Error en la solicitud: ${itemUpdated.status} - ${itemUpdated.statusText}`)
        }

        const itemData = await itemUpdated.json()

        res.status(httpStatusCode).json(itemData)
      }
    } catch (error) {
      console.error('Failed to create order:', error)
      res.status(500).json({ error: 'Failed to capture order.' })
    }
  }
}
