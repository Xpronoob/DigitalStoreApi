export interface ProductDetailEntity {
  product_id: number
  details_name: string
  description?: string
  price: number
  quantity?: number
  color?: string
  size?: string
  storage?: string
  devices?: string
  active: boolean
  img?: string
}

export interface ProductDetailEntityOptional {
  product_id?: number
  details_name?: string
  description?: string
  price?: number
  quantity?: number
  color?: string
  size?: string
  storage?: string
  devices?: string
  active?: boolean
  img?: string
}
