import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class RolesMiddleware {
  static validateRoles = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.body.user?.user_id

        if (!userId) {
          return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        const userRoles = await prisma.users_roles.findMany({
          where: { user_id: userId },
          include: { roles: true },
        })

        const userRoleNames = userRoles.map(
          (userRole) => userRole.roles.role_name,
        )

        const hasRole = roles.some((role) => userRoleNames.includes(role))

        if (!hasRole) {
          return res.status(401).json({ message: 'Usuario no autorizado' })
        }

        next()
      } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error interno del servidor' })
      }
    }
  }
}
