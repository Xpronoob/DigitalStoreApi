export interface AddressesEntity {
  address_id?: number
  default_address?: boolean
  user_id: number
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface AddressesEntityOptional {
  address_id?: number
  default_address?: boolean
  user_id?: number
  street?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}
