import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import {
  AddressesEntity,
  AddressesEntityOptional,
} from '../entities/adresses.entity'

export class ZodAddressesAdapter {
  static validateAddress = (adresses: AddressesEntity) => {
    const Address = z.object({
      user_id: z.number({
        required_error: 'El ID del usuario es obligatorio',
      }),
      street: z
        .string({
          required_error: 'La calle es obligatoria',
        })
        .min(1, 'La calle es obligatoria'),
      city: z
        .string({
          required_error: 'La ciudad es obligatoria',
        })
        .min(1, 'La ciudad es obligatoria'),
      state: z.string().nullable(),
      postal_code: z
        .string({
          required_error: 'El código postal es obligatorio',
        })
        .min(1, 'El código postal es obligatorio'),
      country: z
        .string({
          required_error: 'El país es obligatorio',
        })
        .min(1, 'El país es obligatorio'),
      default_address: z.boolean().optional(),
    })

    try {
      return Address.parse(adresses)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateAddressUpdate = (data: any) => {
    const AddressUpdate = z.object({
      street: z.string().min(1, 'La calle es obligatoria').optional(),
      city: z.string().min(1, 'La ciudad es obligatoria').optional(),
      state: z.string().nullable().optional(),
      postal_code: z
        .string()
        .min(1, 'El código postal es obligatorio')
        .optional(),
      country: z.string().min(1, 'El país es obligatorio').optional(),
      default_address: z.boolean().optional(),
    })

    try {
      return AddressUpdate.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
