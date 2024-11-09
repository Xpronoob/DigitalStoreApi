import { z } from 'zod'
import { CustomError } from '../errors/custom.error'
import { ProductEntity, ProductEntityOptional } from '../entities/products.entity'
import { ProductOptionsEntity } from '../entities/product-options.entity'

export class ZodProductsAdapter {
  static validateProduct = (product: ProductEntity) => {
    const Product = z.object({
      product_name: z
        .string({
          required_error: 'El nombre del producto es requerido',
        })
        .min(3, 'El nombre del producto debe tener al menos 3 caracteres')
        .max(255, 'El nombre del producto no puede exceder 255 caracteres'),

      active: z.boolean({
        required_error: 'El estado del producto es requerido',
      }),

      product_options_id: z.number().int('El ID de la opción de producto debe ser un número entero').optional(),

      category_id: z
        .number({
          required_error: 'El ID de la categoría es requerido',
        })
        .int('El ID de la categoría debe ser un número entero'),

      description: z.string().optional(),

      price: z
        .number({
          required_error: 'El precio es requerido',
        })
        .positive('El precio debe ser un número positivo')
        .max(9999999.99, 'El precio es demasiado alto'),

      stock: z.number().int('El stock debe ser un número entero').nonnegative('El stock no puede ser negativo').optional(),

      img: z.string().url('Debe ser una URL válida').optional(),
    })

    try {
      return Product.parse(product)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateProductOptional = (product: ProductEntityOptional) => {
    const Product = z.object({
      product_name: z
        .string()
        .min(3, 'El nombre del producto debe tener al menos 3 caracteres')
        .max(255, 'El nombre del producto no puede exceder 255 caracteres')
        .optional(),

      active: z.boolean().optional(),

      category_id: z.number().int('El ID de la categoría debe ser un número entero').optional(),

      description: z.string().optional(),

      price: z.number().positive('El precio debe ser un número positivo').max(9999999.99, 'El precio es demasiado alto').optional(),

      stock: z.number().int('El stock debe ser un número entero').nonnegative('El stock no puede ser negativo').optional(),

      img: z.string().url('Debe ser una URL válida').optional(),
    })

    try {
      return Product.parse(product)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }

  static validateProductOptions = (product: ProductOptionsEntity) => {
    const ProductOptions = z.object({
      product_options_name: z
        .string({ required_error: 'El nombre del producto es obligatorio' })
        // .min(3, 'El nombre del producto debe tener al menos 3 caracteres')
        .max(150, 'El nombre del producto no puede exceder 150 caracteres'),
      active: z.boolean().optional(),
      color: z.boolean().optional(),
      size: z.boolean().optional(),
      storage: z.boolean().optional(),
      devices: z.boolean().optional(),
    })

    try {
      return ProductOptions.parse(product)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw CustomError.badRequest(error.errors[0].message)
      }
      throw CustomError.internalServer()
    }
  }
}
