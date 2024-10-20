import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import { RoleEntity } from '../entities/role.entity'

export class ZodRolesAdapter {
  static validateRole = (role: RoleEntity) => {
    const Role = z.object({
      role_name: z
        .string({
          required_error: 'El rol del rol es requerido',
        })
        .min(3, 'El rol debe tener al menos 3 caracteres')
        .max(50, 'El rol no puede tener más de 50 caracteres'),
    })

    try {
      return Role.parse(role)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
