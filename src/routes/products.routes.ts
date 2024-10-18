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
    
    router.post('/products', controller.create);       
    router.patch('/products/:id', controller.patch);     
    router.delete('/products/:id', controller.delete);  
    router.get('/products/:id', controller.getById);    
    router.get('/products', controller.getAll);         

    return router;
  }
}
