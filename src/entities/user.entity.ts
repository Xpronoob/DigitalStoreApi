export interface UserEntity {
  email: string
  password: string
  active: boolean
  first_name?: string
  last_name?: string
  phone_number?: string
  img?: string
}

export interface UserEntityOptional {
  email?: string
  password?: string
  active?: boolean
  first_name?: string
  last_name?: string
  phone_number?: string
  img?: string
}
