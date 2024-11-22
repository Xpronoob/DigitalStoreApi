import { Request, Response } from 'express'
import { CustomError } from '../errors/custom.error'
import { PublicRepository } from '../repositories/public.repository'

export class PublicController {
  constructor(private readonly publicRepository: PublicRepository) {}

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.publicRepository.getAllProducts(req)
      // console.log(products)
      return res.status(200).json(products)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  getProductDetailsById = async (req: Request, res: Response) => {
    try {
      const productId: number = parseInt(req.params.productId)
      const products = await this.publicRepository.getProductDetailsById(productId)
      // console.log(products)
      return res.status(200).json(products)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }
}
