import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { JwtAdapter } from '../adapters/jwt.adapter'
import { CustomError } from '../errors/custom.error'
import { convertToMillisencods } from '../utils/converters.util'
import { envs } from '../configs/envs.config'
import { BcryptAdapter } from '../adapters/bcrypt.adapter'
import { UserAgentEntity } from '../entities/user-agent.entity'

const prisma = new PrismaClient()

type SignToken = (payload: Object, duration?: number) => Promise<string | null>

export class AuthDatasource {
  constructor(
    private readonly signAccessToken: SignToken = JwtAdapter.generateAccessToken,
    private readonly signRefreshToken: SignToken = JwtAdapter.generateRefreshToken,
  ) {}

  async register(
    validatedData: {
      email: string
      password: string
      first_name?: string
      last_name?: string
      phone_number?: string
    },
    userAgentInfo: UserAgentEntity,
  ) {
    const { email, password, first_name, last_name, phone_number } = validatedData

    const isRegistered = await prisma.users.findFirst({
      where: { email: email },
    })

    if (isRegistered) {
      throw CustomError.badRequest('El usuario ya existe')
    }

    const user = await prisma.users.create({
      data: {
        email,
        password,
        first_name,
        last_name,
        phone_number,
      },
    })

    const payload = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
    }

    const accessToken = await this.signAccessToken(payload)
    const refreshToken = await this.signRefreshToken(payload)

    if (!accessToken || !refreshToken) throw CustomError.internalServer('Error generating token')

    const userSession = await prisma.sessions.create({
      data: {
        user_id: user.user_id,
        refresh_token: refreshToken,
        expires_at: new Date(new Date().getTime() + convertToMillisencods(envs.COOKIE_EXPIRES_REFRESH_TOKEN)),
        device_type: userAgentInfo.deviceType,
        ip_address: userAgentInfo.ipAddress,
        osName: userAgentInfo.osName,
        osVersion: userAgentInfo.osVersion,
        browser: userAgentInfo.browser,
      },
    })

    const userWithTokens = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      accessToken,
      refreshToken,
    }

    return userWithTokens
  }

  async login(validatedData: { email: string; password: string }, userAgentInfo: UserAgentEntity) {
    const { email, password } = validatedData

    const user = await prisma.users.findFirst({
      where: { email: email },
    })

    if (!user) {
      throw CustomError.unauthorized('Usuario no encontrado')
    }

    const passwordMatch = BcryptAdapter.compare(password, user.password)
    if (!passwordMatch) throw CustomError.unauthorized('Contraseña incorrecta')

    const payload = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
    }

    const accessToken = await this.signAccessToken(payload)
    const refreshToken = await this.signRefreshToken(payload)

    if (!accessToken || !refreshToken) throw CustomError.internalServer('Error generating token')

    const userSession = await prisma.sessions.create({
      data: {
        user_id: user.user_id,
        refresh_token: refreshToken,
        expires_at: new Date(new Date().getTime() + convertToMillisencods(envs.COOKIE_EXPIRES_REFRESH_TOKEN)),
        device_type: userAgentInfo.deviceType,
        ip_address: userAgentInfo.ipAddress,
        osName: userAgentInfo.osName,
        osVersion: userAgentInfo.osVersion,
        browser: userAgentInfo.browser,
      },
    })

    const userWithTokens = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      accessToken,
      refreshToken,
    }

    return userWithTokens
  }

  async logout(req: Request) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      throw CustomError.unauthorized('No has iniciado sesión')
    }

    const session = await prisma.sessions.findFirst({
      where: { refresh_token: refreshToken },
    })

    if (!session) {
      throw CustomError.unauthorized('No se encontró la sesión o ya fue cerrada')
    }

    await prisma.sessions.delete({
      where: { refresh_token: refreshToken },
    })

    return true
  }

  async profile(req: Request) {}

  async getUserById(userId: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { user_id: parseInt(userId) },
      })

      if (!user) {
        throw CustomError.notFound('Usuario no encontrado')
      }

      return user
    } catch (error) {
      throw CustomError.internalServer('Error al obtener el usuario')
    }
  }

  async changePassword(userId: number, hashedPassword: string) {
    try {
      const updatedUser = await prisma.users.update({
        where: { user_id: userId },
        data: { password: hashedPassword },
      })

      if (!updatedUser) {
        throw CustomError.notFound('Usuario no encontrado')
      }

      return updatedUser
    } catch (error) {
      throw CustomError.internalServer('Error al actualizar la contraseña')
    }
  }
}
