import { LicensesDatasource } from '../../datasources/admin/licenses.datasource'
import { LicenseEntity } from '../../entities/licenses.entity'
import { LicenseEntityOptional } from '../../entities/licenses.entity'

export class LicensesRepository {
  constructor(private readonly licensesDatasource: LicensesDatasource) {}

  async create(licenseData: LicenseEntity) {
    return await this.licensesDatasource.create(licenseData)
  }

  async update(licenseId: number, licenseData: LicenseEntityOptional) {
    return await this.licensesDatasource.update(licenseId, licenseData)
  }

  async delete(licenseId: number) {
    return await this.licensesDatasource.delete(licenseId)
  }

  async getAll() {
    return await this.licensesDatasource.getAll()
  }

  async getById(licenseId: number) {
    return await this.licensesDatasource.getById(licenseId)
  }

  async toggleStatus(licenseId: number, active: boolean) {
    return await this.licensesDatasource.toggleStatus(licenseId, active)
  }
}
