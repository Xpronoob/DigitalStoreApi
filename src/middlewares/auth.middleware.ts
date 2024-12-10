import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../errors/custom.error'
import { JwtAdapter } from './../adapters/jwt.adapter'
import { PrismaClient } from '@prisma/client'
import { envs } from '../configs/envs.config'
import { convertToMillisencods } from '../utils/converters.util'

const prisma = new PrismaClient()

export class AuthMiddleware {
  constructor() {}

  static authorization = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken ? req.cookies.accessToken : req.headers['authorization']?.split(' ')[1]
    const refreshToken = req.cookies.refreshToken ? req.cookies.refreshToken : req.headers['x-refresh-token']

    try {
      if (!accessToken || !refreshToken) throw CustomError.unauthorized('No has iniciado sesión')

      const payloadAccessToken = await JwtAdapter.validateAccessToken<{
        user_id: string
        expired: boolean
      }>(accessToken)
      const payloadRefreshToken = await JwtAdapter.validateRefreshToken<{
        user_id: string
        expired: boolean
      }>(refreshToken)
      if (!payloadAccessToken || !payloadRefreshToken || payloadRefreshToken.expired) throw CustomError.unauthorized('No estás autorizado')

      // if (envs.DEBUG_MODE) {
      //   console.log('Access Token:', payloadAccessToken)
      // }

      const session = await prisma.sessions.findUnique({
        where: {
          refresh_token: refreshToken,
        },
        include: {
          users: true,
        },
      })

      if (!session || !session.users) throw CustomError.unauthorized('No estás autorizado')

      if (session.users.user_id !== parseInt(payloadRefreshToken.user_id)) {
        throw CustomError.unauthorized('Token no pertenece al usuario')
      }

      const roles = await prisma.users_roles.findMany({
        where: { user_id: session.user_id },
        include: { roles: true },
      })

      const userRoles = roles.map((role) => role.roles.role_name)

      const payload = {
        user_id: session.users.user_id,
        email: session.users.email,
        first_name: session.users.first_name,
        roles: userRoles,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }

      if (payloadAccessToken.expired) {
        const refreshedAccessToken = await JwtAdapter.generateAccessToken(payload)
        if (!refreshedAccessToken) throw CustomError.unauthorized('Error al refrescar')

        res.cookie('accessToken', refreshedAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: convertToMillisencods(envs.JWT_EXPIRES_REFRESH_TOKEN),
        })

        // if (envs.DEBUG_MODE) {
        //   refreshedAccessToken && console.log('Access Token Refreshed Successfully')
        // }

        req.body.user = payload
      }

      req.body.user = payload
      return next()
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error al autenticarse' })
    }
  }
}
