import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { AddressesEntity, AddressesEntityOptional } from '../../entities/adresses.entity'

const prisma = new PrismaClient()

export class AddressesDatasource {
  async create(addressData: AddressesEntity) {
    try {
      const address = await prisma.addresses.create({
        data: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          postal_code: addressData.postal_code,
          country: addressData.country,
          user_id: addressData.user_id,
          default_address: addressData.default_address ?? false,
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

  async getAll(userId: number) {
    try {
      const addresses = await prisma.addresses.findMany({
        where: { user_id: userId },
      })
      return addresses
    } catch (error) {
      throw CustomError.internalServer('Error al obtener las direcciones')
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

  async setDefault(userId: number, addressId: number, defaultValue: boolean) {
    try {
      const address = await prisma.addresses.findUnique({
        where: { address_id: addressId },
      })

      if (!address || address.user_id !== userId) {
        throw CustomError.unauthorized('No puedes modificar esta dirección')
      }

      const updatedAddress = await prisma.addresses.update({
        where: { address_id: address.address_id },
        data: { default_address: defaultValue },
      })

      // todo: update default value to false for all other addresses

      return updatedAddress
    } catch (error) {
      throw CustomError.internalServer('Error al establecer la dirección predeterminada')
    }
  }
}
