import { AddressesDatasource } from '../../datasources/client/adresses.datasource'
import { AddressesEntity, AddressesEntityOptional } from '../../entities/adresses.entity'

export class AddressesRepository {
  constructor(private readonly addressesDatasource: AddressesDatasource) {}

  async create(addressData: AddressesEntity) {
    return await this.addressesDatasource.create(addressData)
  }

  async update(addressId: number, addressData: AddressesEntityOptional) {
    return await this.addressesDatasource.update(addressId, addressData)
  }

  async delete(addressId: number) {
    return await this.addressesDatasource.delete(addressId)
  }

  async getAll(userId: number) {
    return await this.addressesDatasource.getAll(userId)
  }

  async getById(addressId: number) {
    return await this.addressesDatasource.getById(addressId)
  }

  async setDefault(userId: number, addressId: number, defaultValue: boolean) {
    return await this.addressesDatasource.setDefault(userId, addressId, defaultValue)
  }
}
