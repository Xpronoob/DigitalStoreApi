import { Request, Response } from "express";
import { ProductsRepository } from "../repositories/products.repository";
import { ZodProductsAdapter } from "../adapters/zod.products.adapter";
import { CustomError } from "../errors/custom.error";

// DI
export class ProductsController {
  constructor(private readonly productsRepository: ProductsRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodProductsAdapter.validateProduct(req.body);
      const product = await this.productsRepository.create(validatedData);

      if (!product) throw CustomError.internalServer("Error al crear el producto");

      res.status(201).json({
        message: "Producto creado exitosamente",
        product,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json(error);
      console.log(error);
    }
  };

  patch = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodProductsAdapter.validateProductOptional(req.body);
      const updatedProduct = await this.productsRepository.patch(parseInt(req.params.id), validatedData);

      if (!updatedProduct) throw CustomError.internalServer("Error al actualizar el producto");

      res.status(200).json({
        message: "Producto actualizado exitosamente",
        updatedProduct,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json(error);
      console.log(error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const deletedProduct = await this.productsRepository.delete(parseInt(req.params.id));

      if (!deletedProduct) throw CustomError.internalServer("Error al eliminar el producto");

      res.status(200).json({
        message: "Producto eliminado exitosamente",
        deletedProduct,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json(error);
      console.log(error);
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const products = await this.productsRepository.getAll();

      if (!products) throw CustomError.internalServer("No se encontraron productos");

      res.status(200).json({
        message: "Productos obtenidos exitosamente",
        products,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json(error);
      console.log(error);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const product = await this.productsRepository.getById(parseInt(req.params.id));

      if (!product) throw CustomError.notFound("Producto no encontrado");

      res.status(200).json({
        message: "Producto obtenido exitosamente",
        product,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json(error);
      console.error(error);
    }
  };

  toggleStatus = async (req: Request, res: Response) => {
    try {
      console.log("Hola")
      const { productId } = req.params;
      const { active } = req.body;  

      const updatedProduct = await this.productsRepository.toggleStatus(parseInt(productId), active);

      if (!updatedProduct) throw CustomError.internalServer("Error al actualizar el estado del producto");

      res.status(200).json({
        message: active ? "Producto activado exitosamente" : "Producto desactivado exitosamente",
        updatedProduct,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json(error);
      console.log(error);
    }
  };

}
