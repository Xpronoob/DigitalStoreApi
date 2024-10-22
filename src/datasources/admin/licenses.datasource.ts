import { PrismaClient } from '@prisma/client'
import { CustomError } from '../../errors/custom.error'
import { LicenseEntity, LicenseEntityOptional } from '../../entities/licenses.entity'

const prisma = new PrismaClient()

export class LicensesDatasource {
  async create(licenseData: LicenseEntity) {
    try {
      const license = await prisma.licenses.create({
        data: {
          order_item_id: licenseData.order_item_id,
          license_key: licenseData.license_key,
          issued_at: licenseData.issued_at,
          active: licenseData.active,
        },
      })
      return license
    } catch (error) {
      throw CustomError.internalServer('Error al crear la licencia.')
    }
  }

  async update(licenseId: number, licenseData: LicenseEntityOptional) {
    try {
      const updatedLicense = await prisma.licenses.update({
        where: { license_id: licenseId },
        data: {
          order_item_id: licenseData.order_item_id,
          license_key: licenseData.license_key,
          issued_at: licenseData.issued_at,
          active: licenseData.active,
        },
      })
      return updatedLicense
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar la licencia')
    }
  }

  async delete(licenseId: number) {
    try {
      const deletedLicense = await prisma.licenses.delete({
        where: { license_id: licenseId },
      })
      return deletedLicense
    } catch (error) {
      throw CustomError.internalServer('Error al eliminar la licencia')
    }
  }

  async getAll() {
    try {
      const licenses = await prisma.licenses.findMany()
      return licenses
    } catch (error) {
      throw CustomError.internalServer('Error al obtener las licencias')
    }
  }

  async getById(licenseId: number) {
    try {
      const license = await prisma.licenses.findUnique({
        where: { license_id: licenseId },
      })
      if (!license) {
        throw CustomError.notFound('Licencia no encontrada')
      }
      return license
    } catch (error) {
      throw CustomError.internalServer('Error al obtener la licencia')
    }
  }

  async toggleStatus(licenseId: number, active: boolean) {
    try {
      const updatedLicense = await prisma.licenses.update({
        where: { license_id: licenseId },
        data: {
          active: active,
        },
      })
      return updatedLicense
    } catch (error) {
      throw CustomError.internalServer(`Error al ${active ? 'activar' : 'desactivar'} la licencia`)
    }
  }
}
