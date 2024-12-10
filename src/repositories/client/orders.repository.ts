import { OrdersDatasource } from '../../datasources/client/orders.datasource'
import { PaymentsPaypalEntity, PaymentsPaypalEntityOptional } from '../../entities/payments-paypal.entity'
import { UserEntityOptional } from '../../entities/user.entity'
import { ValidateCartItemsEntity } from '../../entities/validate-cart-items.entity'

export class OrdersRepository {
  constructor(private readonly ordersDatasource: OrdersDatasource) {}

  async create(paymentData: PaymentsPaypalEntityOptional, user: UserEntityOptional) {
    return await this.ordersDatasource.create(paymentData, user)
  }

  async createOrderItems(orderId: number, cart: ValidateCartItemsEntity[]) {
    return await this.ordersDatasource.createOrdersItems(orderId, cart)
  }

  async createPayments(orderId: number, payments: PaymentsPaypalEntity) {
    return await this.ordersDatasource.createPayments(orderId, payments)
  }

  async clearCart(userId: number, cart: ValidateCartItemsEntity[]) {
    return await this.ordersDatasource.clearCart(userId, cart)
  }
}
