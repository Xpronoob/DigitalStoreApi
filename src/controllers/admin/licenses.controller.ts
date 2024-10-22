import { Request, Response } from 'express'
import { LicensesRepository } from '../../repositories/admin/licenses.repository'
import { ZodLicensesAdapter } from '../../adapters/zod.licenses.adapter'
import { CustomError } from '../../errors/custom.error'

export class LicensesController {
  constructor(private readonly licensesRepository: LicensesRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodLicensesAdapter.validateLicense(req.body)
      const license = await this.licensesRepository.create(validatedData)

      if (!license) throw CustomError.internalServer('Error al crear la licencia')

      res.status(201).json({
        message: 'Licencia creada exitosamente',
        license,
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
      const validatedData = ZodLicensesAdapter.validateLicenseOptional(req.body)
      const updatedLicense = await this.licensesRepository.update(parseInt(req.params.id), validatedData)

      if (!updatedLicense) throw CustomError.internalServer('Error al actualizar la licencia')

      res.status(200).json({
        message: 'Licencia actualizada exitosamente',
        updatedLicense,
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
      const deletedLicense = await this.licensesRepository.delete(parseInt(req.params.id))

      if (!deletedLicense) throw CustomError.internalServer('Error al eliminar la licencia')

      res.status(200).json({
        message: 'Licencia eliminada exitosamente',
        deletedLicense,
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
      const licenses = await this.licensesRepository.getAll()

      if (!licenses) throw CustomError.internalServer('No se encontraron licencias')

      res.status(200).json({
        message: 'Licencias obtenidas exitosamente',
        licenses,
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
      const license = await this.licensesRepository.getById(parseInt(req.params.id))

      if (!license) throw CustomError.notFound('Licencia no encontrada')

      res.status(200).json({
        message: 'Licencia obtenida exitosamente',
        license,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.error(error)
    }
  }

  toggleStatus = async (req: Request, res: Response) => {
    try {
      const { licenseId } = req.params
      const { active } = req.body

      const updatedLicense = await this.licensesRepository.toggleStatus(parseInt(licenseId), active)

      if (!updatedLicense) throw CustomError.internalServer('Error al actualizar el estado de la licencia')

      res.status(200).json({
        message: active ? 'Licencia activada exitosamente' : 'Licencia desactivada exitosamente',
        updatedLicense,
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
