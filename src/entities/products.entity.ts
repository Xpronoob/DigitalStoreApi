export interface ProductEntity {
  category_id: number
  product_name: string
  active: boolean
  product_options_id?: number
  description?: string
  price: number
  stock?: number
  img?: string
}

export interface ProductEntityOptional {
  category_id?: number
  product_name?: string
  active?: boolean
  product_options_id?: number
  description?: string
  price?: number
  stock?: number
  img?: string
}
