import { Router } from "express";
import { ProductsController } from "../controllers/products.controller";
import { ProductsDatasource } from "../datasources/products.datasource";
import { ProductsRepository } from "../repositories/products.repository";

export class ProductsRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new ProductsDatasource();
    const repository = new ProductsRepository(datasource);

    const controller = new ProductsController(repository);
    
    router.post('/', controller.create);       
    router.patch('/:id', controller.patch);     
    router.delete('/:id', controller.delete);  
    router.get('/:id', controller.getById);    
    router.get('/', controller.getAll);         

    return router;
  }
}
