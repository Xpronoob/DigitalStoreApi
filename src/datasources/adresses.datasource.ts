import { PrismaClient } from '@prisma/client'
import { CustomError } from '../errors/custom.error'
import {
  AddressesEntity,
  AddressesEntityOptional,
} from '../entities/adresses.entity'

const prisma = new PrismaClient()

export class AddressesDatasource {
  async create(userId: number, addressData: AddressesEntity) {
    try {
      const address = await prisma.addresses.create({
        data: {
          user_id: userId,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          postal_code: addressData.postal_code,
          country: addressData.country,
          default_address: addressData.default_address,
        },
      })
      return address
    } catch (error) {
      throw CustomError.internalServer('Error al crear la dirección')
    }
  }

  async update(addressId: number, addressData: AddressesEntityOptional) {
    try {
      const updatedAddress = await prisma.addresses.update({
        where: { address_id: addressId },
        data: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          postal_code: addressData.postal_code,
          country: addressData.country,
          default_address: addressData.default_address,
        },
      })
      return updatedAddress
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar la dirección')
    }
  }

  async delete(addressId: number) {
    try {
      const deletedAddress = await prisma.addresses.delete({
        where: { address_id: addressId },
      })
      return deletedAddress
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar la dirección')
    }
  }

  async getAllByUser(userId: number) {
    try {
      const addresses = await prisma.addresses.findMany({
        where: { user_id: userId },
      })
      return addresses
    } catch (error) {
      throw CustomError.internalServer(
        'Error al obtener las direcciones del usuario',
      )
    }
  }

  async getById(addressId: number) {
    try {
      const address = await prisma.addresses.findUnique({
        where: { address_id: addressId },
      })
      if (!address) {
        throw CustomError.notFound('Dirección no encontrada')
      }
      return address
    } catch (error) {
      throw CustomError.internalServer('Error al obtener la dirección')
    }
  }

  async setDefaultAddress(userId: number, addressId: number) {
    try {
      await prisma.addresses.updateMany({
        where: { user_id: userId, default_address: true },
        data: { default_address: false },
      })

      const updatedAddress = await prisma.addresses.update({
        where: { address_id: addressId },
        data: { default_address: true },
      })

      return updatedAddress
    } catch (error) {
      throw CustomError.internalServer(
        'Error al establecer la dirección predeterminada',
      )
    }
  }
}
