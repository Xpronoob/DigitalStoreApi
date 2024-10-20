import { Request, Response } from 'express'
import { AddressesRepository } from '../repositories/adresses.repository'
import { ZodAddressesAdapter } from '../adapters/zod.adresses.adapter'
import { CustomError } from '../errors/custom.error'

export class AddressesController {
  constructor(private readonly addressesRepository: AddressesRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.body.user.user_id

      const validatedData = ZodAddressesAdapter.validateAddress(req.body)

      const newAddress = await this.addressesRepository.create(
        userId,
        validatedData,
      )

      if (!newAddress)
        throw CustomError.internalServer('Error al crear la dirección de envío')

      res.status(201).json({
        message: 'Dirección creada exitosamente',
        address: newAddress,
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
      const userId = req.body.user.user_id

      const addresses = await this.addressesRepository.getAllByUser(userId)

      if (!addresses)
        throw CustomError.notFound('No se encontraron direcciones de envío')

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
      const userId = req.body.user.user_id
      const { addressId } = req.params

      const address = await this.addressesRepository.getById(
        userId,
        parseInt(addressId),
      )

      if (!address) throw CustomError.notFound('Dirección no encontrada')

      res.status(200).json(address)
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
      const userId = req.body.user.user_id
      const { addressId } = req.params

      const validatedData = ZodAddressesAdapter.validateAddressUpdate(req.body)

      const updatedAddress = await this.addressesRepository.update(
        userId,
        parseInt(addressId),
        validatedData,
      )

      if (!updatedAddress)
        throw CustomError.internalServer(
          'Error al actualizar la dirección de envío',
        )

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
      const userId = req.body.user.user_id
      const { addressId } = req.params

      const deletedAddress = await this.addressesRepository.delete(
        userId,
        parseInt(addressId),
      )

      if (!deletedAddress)
        throw CustomError.internalServer(
          'Error al eliminar la dirección de envío',
        )

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

  setDefault = async (req: Request, res: Response) => {
    try {
      const userId = req.body.user.user_id
      const { addressId } = req.params

      const defaultAddress = await this.addressesRepository.setDefault(
        userId,
        parseInt(addressId),
      )

      if (!defaultAddress)
        throw CustomError.internalServer(
          'Error al establecer la dirección por defecto',
        )

      res.status(200).json({
        message: 'Dirección por defecto actualizada exitosamente',
        defaultAddress,
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
