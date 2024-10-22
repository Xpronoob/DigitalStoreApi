import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import { LicenseEntity, LicenseEntityOptional } from '../entities/licenses.entity'

export class ZodLicensesAdapter {
  static validateLicense = (license: LicenseEntity) => {
    const License = z.object({
      order_item_id: z
        .number({
          required_error: 'El ID del ítem de la orden es requerido',
        })
        .int('El ID del ítem de la orden debe ser un número entero'),

      license_key: z
        .string({
          required_error: 'La clave de licencia es requerida',
        })
        .min(10, 'La clave de licencia debe tener al menos 10 caracteres')
        .max(255, 'La clave de licencia no puede exceder 255 caracteres'),

      issued_at: z
        .string({
          required_error: 'La fecha de emisión es requerida',
        })
        .refine((val) => !isNaN(Date.parse(val)), {
          message: 'La fecha de emisión debe ser una fecha válida',
        })
        .optional(),

      active: z.boolean({
        required_error: 'El estado de la licencia es requerido',
      }),
    })

    try {
      return License.parse(license)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateLicenseOptional = (license: LicenseEntityOptional) => {
    const License = z.object({
      order_item_id: z.number().int('El ID del ítem de la orden debe ser un número entero').optional(),

      license_key: z
        .string()
        .min(10, 'La clave de licencia debe tener al menos 10 caracteres')
        .max(255, 'La clave de licencia no puede exceder 255 caracteres')
        .optional(),

      issued_at: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: 'La fecha de emisión debe ser una fecha válida',
        })
        .optional(),

      active: z.boolean().optional(),
    })

    try {
      return License.parse(license)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
