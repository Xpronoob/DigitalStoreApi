export interface ProductDetailsEntity {
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

export interface ProductDetailsEntityOptional {
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
