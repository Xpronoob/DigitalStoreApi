import { PrismaClient } from "@prisma/client";
import { CustomError } from "../errors/custom.error";
import { ProductEntity } from "../entities/products.entity";
import { ProductEntityOptional } from '../entities/products.entity';

const prisma = new PrismaClient();

export class ProductsDatasource {
  async create(productData: ProductEntity) {
    try {
      const product = await prisma.products.create({
        data: {
          category_id: productData.category_id,
          product_name: productData.product_name,
          active: productData.active,
          product_option_id: productData.product_option_id,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          img: productData.img,
        },
      });
      return product;
    } catch (error) {
      throw CustomError.internalServer("Error al crear el producto");
    }
  }

  async patch(productId: number, productData: ProductEntityOptional) {
    try {
      const patchProduct = await prisma.products.update({
        where: { product_id: productId },
        data: {
          category_id: productData.category_id,
          product_name: productData.product_name,
          active: productData.active,
          product_option_id: productData.product_option_id,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          img: productData.img,
        },
      });
      return patchProduct;
    } catch (error) {
      throw CustomError.internalServer("Error al actualizar el producto");
    }
  }

  async delete(productId: number) {
    try {
      const deletedProduct = await prisma.products.delete({
        where: { product_id: productId },
      });
      return deletedProduct;
    } catch (error) {
      throw CustomError.internalServer("Error al eliminar el producto");
    }
  }

  async getAll() {
    try {
      const products = await prisma.products.findMany();
      return products;
    } catch (error) {
      throw CustomError.internalServer("Error al obtener los productos");
    }
  }

  async getById(productId: number) {
    try {
      const product = await prisma.products.findUnique({
        where: { product_id: productId },
      });
      if (!product) {
        throw CustomError.notFound("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw CustomError.internalServer("Error al obtener el producto");
    }
  }
}
