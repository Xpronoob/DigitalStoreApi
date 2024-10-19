import { Request, Response, Router } from "express";
import { AuthRoutes } from "./auth.routes";
import { CategoriesRoutes } from "./categories.routes";
import { UsersRoutes } from "./users.routes";
import { RolesRoutes } from "./roles.routes";
import { ProductsRoutes } from "./products.routes";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AppRoutes {
  static get routes(): Router {
   const router = Router()

    const healthCheck = (req: Request, res: Response) => {
      console.log("Health check")
      return res.status(200).json({ status: "API is healthy" })
    }
    
    router.get('/health', healthCheck)
    router.use('/api/auth', AuthRoutes.routes)
    
    router.use('/api/users', AuthMiddleware.authorization, UsersRoutes.routes)
    router.use('/api/roles', AuthMiddleware.authorization,  RolesRoutes.routes)
  
    router.use('/api/categories', AuthMiddleware.authorization,  CategoriesRoutes.routes)
    router.use('/api/products', AuthMiddleware.authorization,  ProductsRoutes.routes)
    
    return router
  }
}