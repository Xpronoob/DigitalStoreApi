import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import {
  AddressesEntity,
  AddressesEntityOptional,
} from '../entities/adresses.entity'

export class ZodAddressesAdapter {
  static validateAddress = (address: AddressesEntity) => {
    const Address = z.object({
      street: z
        .string({
          required_error: 'La calle es requerida',
        })
        .min(1, 'La calle debe tener al menos 1 carácter')
        .max(255, 'La calle no puede tener más de 255 caracteres'),
      city: z
        .string({
          required_error: 'La ciudad es requerida',
        })
        .min(1, 'La ciudad debe tener al menos 1 carácter')
        .max(255, 'La ciudad no puede tener más de 255 caracteres'),
      state: z
        .string({
          required_error: 'El estado es requerido',
        })
        .min(1, 'El estado debe tener al menos 1 carácter')
        .max(255, 'El estado no puede tener más de 255 caracteres'),
      postal_code: z
        .string({
          required_error: 'El código postal es requerido',
        })
        .min(1, 'El código postal debe tener al menos 1 carácter')
        .max(20, 'El código postal no puede tener más de 20 caracteres'),
      country: z
        .string({
          required_error: 'El país es requerido',
        })
        .min(1, 'El país debe tener al menos 1 carácter')
        .max(255, 'El país no puede tener más de 255 caracteres'),
      user_id: z.number({
        required_error: 'El ID de usuario es requerido',
      }),
      default_address: z.boolean().optional(),
      address_id: z.number().optional(),
    })

    try {
      return Address.parse(address)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateAddressUpdate = (address: AddressesEntityOptional) => {
    const Address = z.object({
      street: z
        .string()
        .min(1, 'La calle debe tener al menos 1 carácter')
        .max(255)
        .optional(),
      city: z
        .string()
        .min(1, 'La ciudad debe tener al menos 1 carácter')
        .max(255)
        .optional(),
      state: z
        .string()
        .min(1, 'El estado debe tener al menos 1 carácter')
        .max(255)
        .optional(),
      postal_code: z
        .string()
        .min(1, 'El código postal debe tener al menos 1 carácter')
        .max(20)
        .optional(),
      country: z
        .string()
        .min(1, 'El país debe tener al menos 1 carácter')
        .max(255)
        .optional(),
      user_id: z.number().optional(),
      default_address: z.boolean().optional(),
      address_id: z.number().optional(),
    })

    try {
      return Address.parse(address)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
