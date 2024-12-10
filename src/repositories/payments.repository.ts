import { PaymentsDatasource } from '../datasources/payments.datasources'

export class PaymentsRepository {
  constructor(private readonly paymentsDatasource: PaymentsDatasource) {}

  async validateItems(cart: any[]) {
    return await this.paymentsDatasource.validateItems(cart)
  }

  async discountStockItems(data: any) {
    return await this.paymentsDatasource.discountStockItems(data)
  }
}
