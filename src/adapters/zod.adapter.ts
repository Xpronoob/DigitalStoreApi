import { z } from "zod"
import { CustomError } from "../errors/custom.error"

export class ZodAdapter {

  static validateAuthUser = (user: { email: string, password: string, first_name?: string, last_name?: string }) => {

    const User = z.object({
      email: z.string({
        required_error: "El email es requerido"
      }).email("Debe ser un email válido"),
      password: z.string({required_error: "La contraseña es requerida"})
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña es demasiado larga"),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      phone_number: z.string().optional(),
    })

    try {
      return User.parse(user)

    } catch (error) {
      if (error instanceof z.ZodError) { 
        throw CustomError.badRequest(error.errors[0].message);
      }
        throw CustomError.internalServer()
    }
  }
}