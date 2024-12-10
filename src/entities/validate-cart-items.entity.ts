export interface ValidateCartItemsEntity {
  product_details_id: number
  details_name: string
  stock: number
  unitPrice: number
  active: boolean
  quantity: number
  totalPrice: number
}

export type ValidateCartItemsEntityOptional = Partial<ValidateCartItemsEntity>
