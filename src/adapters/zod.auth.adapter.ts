import { z } from 'zod'
import { CustomError } from '../errors/custom.error'

export class ZodAuthAdapter {
  static validateAuthUser = (user: { email: string; password: string; first_name?: string; last_name?: string }) => {
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
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      phone_number: z.string().optional(),
      img: z.string().optional(),
    })

    try {
      const { email, password, first_name, last_name, phone_number, img } = User.parse(user)
      const validatedData = {
        email,
        password,
        first_name,
        last_name,
        phone_number,
        img,
      }

      return validatedData
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateChangePassword = (passwordData: { oldPassword: string; newPassword: string }) => {
    const PasswordSchema = z.object({
      oldPassword: z.string({ required_error: 'La contraseña actual es requerida' }).min(8, 'La contraseña actual debe tener al menos 8 caracteres'),
      newPassword: z
        .string({ required_error: 'La nueva contraseña es requerida' })
        .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
        .max(100, 'La nueva contraseña es demasiado larga'),
    })

    try {
      const { oldPassword, newPassword } = PasswordSchema.parse(passwordData)

      return { oldPassword, newPassword }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateForgotPassword = (data: { email: string }) => {
    const ForgotPasswordSchema = z.object({
      email: z.string({ required_error: 'El email es requerido' }).email('Debe ser un email válido'),
    })

    try {
      const { email } = ForgotPasswordSchema.parse(data)

      return { email }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateResetPassword = (data: { token: string; newPassword: string }) => {
    const ResetPasswordSchema = z.object({
      token: z.string({ required_error: 'El token es requerido' }),
      newPassword: z
        .string({ required_error: 'La nueva contraseña es requerida' })
        .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
        .max(100, 'La nueva contraseña es demasiado larga'),
    })

    try {
      const { token, newPassword } = ResetPasswordSchema.parse(data)

      return { token, newPassword }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
