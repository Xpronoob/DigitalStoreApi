import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import { ProductDetailEntity, ProductDetailEntityOptional } from '../entities/product-details'

export class ZodProductDetailsAdapter {
  static validateProductDetail = (productDetail: ProductDetailEntity) => {
    const ProductDetail = z.object({
      product_id: z.number({
        required_error: 'El ID del producto es requerido',
      }),
      details_name: z
        .string({
          required_error: 'El nombre del detalle del producto es requerido',
        })
        .min(1, 'El nombre del detalle debe tener al menos 1 carácter')
        .max(255, 'El nombre del detalle no puede tener más de 255 caracteres'),
      description: z.string().max(255, 'La descripción no puede tener más de 255 caracteres').optional(),
      price: z
        .number({
          required_error: 'El precio es requerido',
        })
        .min(0, 'El precio debe ser un valor positivo'),
      quantity: z.number().min(0, 'La cantidad debe ser un valor positivo').optional(),
      color: z.string().max(100).optional(),
      size: z.string().max(50).optional(),
      storage: z.string().max(50).optional(),
      devices: z.string().max(50).optional(),
      img: z.string().max(500).optional(),
      active: z.boolean(),
    })

    try {
      return ProductDetail.parse(productDetail)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateProductDetailUpdate = (productDetail: ProductDetailEntityOptional) => {
    const ProductDetail = z.object({
      details_name: z
        .string()
        .min(1, 'El nombre del detalle debe tener al menos 1 carácter')
        .max(255, 'El nombre del detalle no puede tener más de 255 caracteres')
        .optional(),
      description: z.string().max(255).optional(),
      price: z.number().min(0, 'El precio debe ser un valor positivo').optional(),
      quantity: z.number().min(0, 'La cantidad debe ser un valor positivo').optional(),
      color: z.string().max(100).optional(),
      size: z.string().max(50).optional(),
      storage: z.string().max(50).optional(),
      devices: z.string().max(50).optional(),
      img: z.string().max(500).optional(),
      active: z.boolean().optional(),
    })

    try {
      return ProductDetail.parse(productDetail)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
