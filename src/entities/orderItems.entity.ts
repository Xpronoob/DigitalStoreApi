export interface OrderItemsEntity {
  order_items_id?: number
  order_id: number
  product_id: number
  product_details_id: number
  details_name: string
  quantity: number
  price: number
  product_name?: string
  description?: string
  color?: string
  size?: string
  storage?: string
  devices?: string
  img?: string
  discount?: number
  tax?: number
}

export type OrderItemsEntityOptional = Partial<OrderItemsEntity>
