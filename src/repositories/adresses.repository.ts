import {
  AddressesEntity,
  AddressesEntityOptional,
} from '../entities/adresses.entity'
import { AddressesDatasource } from '../datasources/adresses.datasource'

export class AddressesRepository {
  constructor(private readonly addressesDatasource: AddressesDatasource) {}

  async create(userId: number, addressData: AddressesEntity) {
    return await this.addressesDatasource.create(userId, addressData)
  }

  async update(addressId: number, addressData: AddressesEntityOptional) {
    return await this.addressesDatasource.update(addressId, addressData)
  }

  async delete(addressId: number) {
    return await this.addressesDatasource.delete(addressId)
  }

  async getAllByUser(userId: number) {
    return await this.addressesDatasource.getAllByUser(userId)
  }

  async getById(addressId: number) {
    return await this.addressesDatasource.getById(addressId)
  }

  async setDefaultAddress(userId: number, addressId: number) {
    return await this.addressesDatasource.setDefaultAddress(userId, addressId)
  }
}
