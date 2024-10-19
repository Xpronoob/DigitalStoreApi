import { Router } from "express"
import { CategoriesController } from "../controllers/categories.controller"
import { CategoriesDatasource } from "../datasources/categories.datasource"
import { CategoriesRepository } from "../repositories/categories.repository"
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class CategoriesRoutes {
  static get routes(): Router{
    const router = Router()

    const datasource = new CategoriesDatasource()
    const repository = new CategoriesRepository(datasource)

    const controller = new CategoriesController(repository)
    
    router.post('/', controller.create)
    router.put('/:id', controller.update)
    router.delete('/:id', controller.delete)
    router.get('/:id', controller.getById)
    router.get('/', controller.getAll)
    

    //RES
    /* 
      
      C         /categories x
      R_A       /categories x
      R_BY_ID   /categories/:id
      U         /categories/:id x
      D         /categories/:id x

      GET ALL IDS()
    */

    return router
  }
}