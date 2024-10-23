import { CartItemsDatasource } from '../../datasources/client/cart-items.datasource'
import { CartItemsEntity, CartItemsUpdateEntity } from '../../entities/cart-items.entity'

export class CartItemsRepository {
  constructor(private readonly cartItemsDatasource: CartItemsDatasource) {}

  async create(cartItemsData: CartItemsEntity) {
    return await this.cartItemsDatasource.create(cartItemsData)
  }

  async update(cartItemId: number, cartItemsData: CartItemsUpdateEntity) {
    return await this.cartItemsDatasource.update(cartItemId, cartItemsData)
  }

  async delete(cartItemId: number) {
    return await this.cartItemsDatasource.delete(cartItemId)
  }

  async getAll(userId: number) {
    return await this.cartItemsDatasource.getAll(userId)
  }

  async getById(cartItemId: number) {
    return await this.cartItemsDatasource.getById(cartItemId)
  }
}
