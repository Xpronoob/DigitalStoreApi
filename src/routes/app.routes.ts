import { Request, Response, Router } from 'express'
import { AuthRoutes } from './auth.routes'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { RolesMiddleware } from '../middlewares/roles.middleware'
import { UsersAdminRoutes, RolesAdminRoutes, CategoriesAdminRoutes, ProductsAdminRoutes, ProductDetailsAdminRoutes } from './admin/'
import { UsersClientRoutes, CartItemsClientRoutes, OrdersClientRoutes } from './client'

export class AppRoutes {
  static get routes(): Router {
    const router = Router()

    const healthCheck = (req: Request, res: Response) => {
      console.log('Health check')
      return res.status(200).json({ status: 'API is healthy' })
    }

    router.get('/health', healthCheck)
    router.use('/api/auth', AuthRoutes.routes)

    // * * ADMIN ROUTES
    router.use('/api/admin/users', AuthMiddleware.authorization, RolesMiddleware.validateRoles(['admin']), UsersAdminRoutes.routes)
    router.use('/api/admin/roles', AuthMiddleware.authorization, RolesMiddleware.validateRoles(['admin']), RolesAdminRoutes.routes)

    router.use('/api/admin/categories', AuthMiddleware.authorization, RolesMiddleware.validateRoles(['admin']), CategoriesAdminRoutes.routes)
    router.use('/api/admin/products', AuthMiddleware.authorization, RolesMiddleware.validateRoles(['admin']), ProductsAdminRoutes.routes)
    router.use('/api/admin/productsdetails', AuthMiddleware.authorization, RolesMiddleware.validateRoles(['admin']), ProductDetailsAdminRoutes.routes)

    // * * CLIENT ROUTES

    // Profile, Update User Info, Update Password, Delete Account, change photo
    // Sessions, Security, Configs, Check Roles
    // Addresses, Payments
    router.use('/api/client/user', AuthMiddleware.authorization, RolesMiddleware.validateRoles(['admin', 'client']), UsersClientRoutes.routes)

    // Cart Items (Shopping Cart)
    router.use(
      '/api/client/cartItems',
      AuthMiddleware.authorization,
      RolesMiddleware.validateRoles(['admin', 'client']),
      CartItemsClientRoutes.routes,
    )

    // Orders, Order Items
    router.use('/api/client/orders', AuthMiddleware.authorization, RolesMiddleware.validateRoles(['admin', 'client']), OrdersClientRoutes.routes)

    // * * GUEST ROUTES

    return router
  }
}
