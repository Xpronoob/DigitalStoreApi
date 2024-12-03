import { Request, Response } from 'express'
import { CustomError } from '../errors/custom.error'
import { PaymentsRepository } from '../repositories/payments.repository'
import { ApiError, CheckoutPaymentIntent, Client, Environment, LogLevel, OrdersController } from '@paypal/paypal-server-sdk'
import { envs, parseToString } from '../configs/envs.config'

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
      throw new Error(error.message)
    }
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

    // todo: discount stock items from DB
    // todo: create order item
    // todo: send whatsapp to user (if have phone validation)
    // todo: send email to user (if have email validation)
    return {
      jsonResponse: JSON.parse(body as string),
      httpStatusCode: httpResponse.statusCode,
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

      const validatedItems = await this.paymentsRepository.validateItems(cart)
      const mappedItems = mapItems(validatedItems)

      const totals = calculateOrderTotals(validatedItems)

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
    console.log('Capture Order Controller')
    try {
      const { orderID } = req.params
      const { jsonResponse, httpStatusCode } = await captureOrder(orderID)
      res.status(httpStatusCode).json(jsonResponse)
    } catch (error) {
      console.error('Failed to create order:', error)
      res.status(500).json({ error: 'Failed to capture order.' })
    }
  }
}
