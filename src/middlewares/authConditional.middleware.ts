import { NextFunction, Request, Response } from 'express'
import { JwtAdapter } from './../adapters/jwt.adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AuthConditionalMiddleware {
  constructor() {}

  static authorization = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken ? req.cookies.accessToken : req.headers['authorization']?.split(' ')[1]
    const refreshToken = req.cookies.refreshToken ? req.cookies.refreshToken : req.headers['x-refresh-token']
    try {
      if (!accessToken || !refreshToken) return next()

      const payloadAccessToken = await JwtAdapter.validateAccessToken<{
        user_id: string
        expired: boolean
      }>(accessToken)
      const payloadRefreshToken = await JwtAdapter.validateRefreshToken<{
        user_id: string
        expired: boolean
      }>(refreshToken)
      if (!payloadAccessToken || !payloadRefreshToken || payloadRefreshToken.expired) return next()

      const session = await prisma.sessions.findUnique({
        where: {
          refresh_token: refreshToken,
        },
        include: {
          users: true,
        },
      })

      if (!session || !session.users) return next()

      if (session.users.user_id !== parseInt(payloadRefreshToken.user_id)) {
        return next()
      }

      const payload = {
        user_id: session.users.user_id,
        email: session.users.email,
        first_name: session.users.first_name,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }

      if (payloadAccessToken.expired) {
        const refreshedAccessToken = await JwtAdapter.generateAccessToken(payload)
        if (!refreshedAccessToken) return next()

        res.cookie('accessToken', refreshedAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })

        req.body.user = payload
      }

      req.body.user = payload
      return next()
    } catch (error) {
      req.body.user = null
      return next()
    }
  }
}
