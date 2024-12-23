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
      img?: string
    },
    userAgentInfo: UserAgentEntity,
  ) {
    const { email, password, first_name, last_name, phone_number, img } = validatedData

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
        img,
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
        expires_at: new Date(new Date().getTime() + convertToMillisencods(envs.JWT_EXPIRES_REFRESH_TOKEN)),
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
      include: { users_roles: true },
    })

    if (!user) {
      throw CustomError.unauthorized('Usuario no encontrado')
    }

    const roles = await prisma.users_roles.findMany({
      where: { user_id: user.user_id },
      include: { roles: true },
    })

    const userRoles = roles.map((role) => role.roles.role_name)

    // console.log(userRoles)

    const passwordMatch = BcryptAdapter.compare(password, user.password)
    if (!passwordMatch) throw CustomError.unauthorized('Contraseña incorrecta')

    const payload = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      roles: userRoles,
    }

    const accessToken = await this.signAccessToken(payload)
    const refreshToken = await this.signRefreshToken(payload)

    if (!accessToken || !refreshToken) throw CustomError.internalServer('Error generating token')

    const userSession = await prisma.sessions.create({
      data: {
        user_id: user.user_id,
        refresh_token: refreshToken,
        expires_at: new Date(new Date().getTime() + convertToMillisencods(envs.JWT_EXPIRES_REFRESH_TOKEN)),
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
      roles: userRoles,
      accessToken,
      refreshToken,
    }

    return userWithTokens
  }

  async logout(req: Request) {
    const refreshToken = req.cookies.refreshToken
    // if (!refreshToken) {
    //   throw CustomError.unauthorized('No has iniciado sesión')
    // }

    if (refreshToken) {
      const session = await prisma.sessions.findFirst({
        where: { refresh_token: refreshToken },
      })
      if (session) {
        await prisma.sessions.delete({
          where: { refresh_token: refreshToken },
        })
      }
    }

    // if (!session) {
    //   throw CustomError.unauthorized('No se encontró la sesión o ya fue cerrada')
    // }

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

  async getUserByEmail(email: string) {
    const user = await prisma.users.findUnique({
      where: { email },
    })

    if (!user) {
      throw CustomError.notFound('Usuario no encontrado')
    }

    return user
  }

  async generatePasswordResetToken(userId: number) {
    const resetToken = await JwtAdapter.generatePasswordResetToken(userId)
    if (!resetToken) {
      throw CustomError.internalServer('Error generando el token de recuperación')
    }
    return resetToken
  }

  async savePasswordResetToken(userId: number, token: string) {
    const expiresAt = new Date(new Date().getTime() + convertToMillisencods(envs.RESET_PASSWORD_TOKEN_EXPIRES))

    // Guardar el token sin hashear
    await prisma.password_resets.create({
      data: {
        user_id: userId,
        token: token, // Guardar el JWT directamente
        expires_at: expiresAt,
      },
    })

    return true
  }

  async verifyPasswordResetToken(token: string) {
    const decodedToken = await JwtAdapter.validatePasswordResetToken<{ userId: number; exp?: number }>(token)

    if (!decodedToken || (decodedToken.exp && decodedToken.exp * 1000 < Date.now())) {
      throw CustomError.unauthorized('Token de recuperación inválido o expirado')
    }

    const resetTokenEntry = await prisma.password_resets.findUnique({
      where: {
        token: token,
      },
    })

    if (!resetTokenEntry || resetTokenEntry.expires_at <= new Date()) {
      throw CustomError.unauthorized('Token de recuperación inválido o expirado')
    }

    await prisma.password_resets.delete({
      where: { token: token },
    })

    // Retornar `user_id` si el token es válido
    return resetTokenEntry.user_id
  }
}
