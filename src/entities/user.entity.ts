export interface UserEntity {
  user_id?: number
  email: string
  password: string
  active: boolean
  first_name?: string
  last_name?: string
  phone_number?: string
  img?: string
  roles?: [string]
}

// export interface UserEntityOptional {
//   email?: string
//   password?: string
//   active?: boolean
//   first_name?: string
//   last_name?: string
//   phone_number?: string
//   img?: string
// }

export type UserEntityOptional = Partial<UserEntity>
