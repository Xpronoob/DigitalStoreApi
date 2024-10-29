export interface CartItemsEntity {
  user_id: number
  product_detail_id: number
  quantity: number
}

export interface CartItemsUpdateEntity {
  user_id: number
  product_detail_id?: number
  quantity?: number
}
