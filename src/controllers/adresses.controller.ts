import { Request, Response } from 'express'
import { AddressesRepository } from '../repositories/adresses.repository'
import { ZodAddressesAdapter } from '../adapters/zod.adresses.adapter'
import { CustomError } from '../errors/custom.error'

export class AddressesController {
  constructor(private readonly addressesRepository: AddressesRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const validatedData = ZodAddressesAdapter.validateAddress({
        ...req.body,
        user_id: user.user_id,
      })

      const address = await this.addressesRepository.create(validatedData)
      if (!address)
        throw CustomError.internalServer('Error al crear la dirección')

      res.status(201).json({
        message: 'Dirección creada exitosamente',
        address,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const validatedData = ZodAddressesAdapter.validateAddressUpdate(req.body)

      const updatedAddress = await this.addressesRepository.update(
        parseInt(req.params.id),
        { ...validatedData, user_id: user.user_id },
      )

      if (!updatedAddress)
        throw CustomError.internalServer('Error al actualizar la dirección')

      res.status(200).json({
        message: 'Dirección actualizada exitosamente',
        updatedAddress,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const deletedAddress = await this.addressesRepository.delete(
        parseInt(req.params.id),
      )
      if (!deletedAddress)
        throw CustomError.internalServer('Error al eliminar la dirección')

      res.status(200).json({
        message: 'Dirección eliminada exitosamente',
        deletedAddress,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const addresses = await this.addressesRepository.getAll(user.user_id)
      if (!addresses)
        throw CustomError.internalServer('No se encontraron direcciones')

      res.status(200).json({
        message: 'Direcciones obtenidas exitosamente',
        addresses,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const address = await this.addressesRepository.getById(
        parseInt(req.params.id),
      )
      if (!address)
        throw CustomError.internalServer('No se encontró la dirección')

      res.status(200).json(address)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }

  setDefault = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      const addressId = parseInt(req.params.id)
      const defaultValue = req.body.defaultValue

      const updatedAddress = await this.addressesRepository.setDefault(
        user.user_id,
        addressId,
        defaultValue,
      )

      if (!updatedAddress) {
        throw CustomError.internalServer(
          'Error al establecer la dirección por defecto',
        )
      }

      const message = defaultValue
        ? 'Dirección establecida como predeterminada exitosamente'
        : 'Dirección ya no es predeterminada'

      res.status(200).json({
        message: message,
        updatedAddress,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }
}
