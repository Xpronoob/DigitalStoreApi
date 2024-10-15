import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"
import { AuthDatasource } from "../datasources/auth.datasource"
import { AuthRepository } from "../repositories/auth.repository"
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes {
  static get routes(): Router{
    const router = Router()

    const datasource = new AuthDatasource()
    const repository = new AuthRepository(datasource)

    const controller = new AuthController(repository)
    
    router.post('/login', controller.login)
    router.post('/register', controller.register)
    router.get('/logout', controller.logout)

    router.get('/profile', [AuthMiddleware.authorization], controller.profile)

    return router
  }
}