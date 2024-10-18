import { Request, Response, Router } from "express";
import { AuthRoutes } from "./auth.routes";
import { CategoriesRoutes } from "./categories.routes";
import { ProductsRoutes } from "./products.routes";

export class AppRoutes {
  static get routes(): Router {
   const router = Router()

    const healthCheck = (req: Request, res: Response) => {
      console.log("Health check")
      return res.status(200).json({ status: "API is healthy" })
    }
    
    router.get('/health', healthCheck)
    router.use('/api', AuthRoutes.routes)
    //todo: // router.use('/api', UserRoutes.routes)
  
    router.use('/api', CategoriesRoutes.routes)

    router.use('/api', ProductsRoutes.routes)
    
    return router
  }
}