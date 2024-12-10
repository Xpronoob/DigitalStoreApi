export interface OrdersEntity {
  order_id?: number
  user_id?: number
  address_id?: number
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  street: string
  city: string
  state?: string
  postal_code: string
  country: string
  total_amount: number
  payment_fee: number
  net_amount: number
  tracking_code?: string
  status: string
  order_date: string | Date
}

export type OrdersEntityOptional = Partial<OrdersEntity>
