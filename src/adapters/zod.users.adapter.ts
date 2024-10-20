import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import { UserEntity, UserEntityOptional } from '../entities/user.entity'

export class ZodUsersAdapter {
  static validateUser = (user: UserEntity) => {
    const User = z.object({
      email: z
        .string({
          required_error: 'El email es requerido',
        })
        .email('Debe ser un email válido'),
      password: z
        .string({ required_error: 'La contraseña es requerida' })
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(100, 'La contraseña es demasiado larga'),
      active: z.boolean({ required_error: 'El campo active es requerido' }),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      phone_number: z.string().optional(),
      img: z.string().optional(),
    })

    try {
      return User.parse(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateUserUpdate = (user: UserEntityOptional) => {
    const User = z.object({
      email: z.string().email('Debe ser un email válido').optional(),
      password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(100, 'La contraseña es demasiado larga')
        .optional(),
      active: z.boolean().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      phone_number: z.string().optional(),
      img: z.string().optional(),
    })

    try {
      return User.parse(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
