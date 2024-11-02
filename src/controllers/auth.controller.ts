import { Request, Response } from 'express'
import { AuthRepository } from '../repositories/auth.repository'
import { ZodAuthAdapter } from '../adapters/zod.auth.adapter'
import { CustomError } from '../errors/custom.error'
import { BcryptAdapter } from '../adapters/bcrypt.adapter'
import { convertToMillisencods } from '../utils/converters.util'
import { envs } from '../configs/envs.config'
import { UAParserAdapter } from '../adapters/uaparser.adapter'
import { UserAgentEntity } from '../entities/user-agent.entity'

export class AuthController {
  //DI
  constructor(private readonly authRepository: AuthRepository) {}

  login = async (req: Request, res: Response) => {
    try {
      const userAgent = req.headers['user-agent']

      let userAgentInfo: UserAgentEntity = {}

      if (userAgent) {
        const userAgentResult = UAParserAdapter.parserResults(userAgent)
        const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 'desktop'
        const ipAddress = req.ip

        userAgentInfo = {
          deviceType,
          ipAddress,
          osName: userAgentResult.os.name,
          osVersion: userAgentResult.os.version,
          browser: userAgentResult.browser.name,
        }
      }

      const validatedData = ZodAuthAdapter.validateAuthUser(req.body)
      validatedData.email = validatedData.email.toLowerCase()

      const user = await this.authRepository.login(validatedData, userAgentInfo)
      if (!user) throw CustomError.internalServer('Error al registrar el usuario')

      // Save Access Token & Refresh Token in cookie
      // httpOnly: true - not accesible from JavaScript
      // secure: true - only send over HTTPS
      // sameSite: strict - only send over HTTPS
      res.cookie('accessToken', user.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: convertToMillisencods(envs.COOKIE_EXPIRES_ACCESS_TOKEN),
      })

      res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: convertToMillisencods(envs.COOKIE_EXPIRES_REFRESH_TOKEN),
      })

      res.status(201).json({
        message: 'Has iniciado sesión exitosamente',
        user,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  register = async (req: Request, res: Response) => {
    try {
      const userAgent = req.headers['user-agent']

      let userAgentInfo: UserAgentEntity = {}

      if (userAgent) {
        const userAgentResult = UAParserAdapter.parserResults(userAgent)
        const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 'desktop'
        const ipAddress = req.ip

        userAgentInfo = {
          deviceType,
          ipAddress,
          osName: userAgentResult.os.name,
          osVersion: userAgentResult.os.version,
          browser: userAgentResult.browser.name,
        }
      }

      const validatedData = ZodAuthAdapter.validateAuthUser(req.body)
      validatedData.email = validatedData.email.toLowerCase()
      validatedData.password = BcryptAdapter.hash(validatedData.password)
      const user = await this.authRepository.register(validatedData, userAgentInfo)
      if (!user) throw CustomError.internalServer('Error al registrar el usuario')

      // Save Access Token & Refresh Token in cookie
      // httpOnly: true - not accesible from JavaScript
      // secure: true - only send over HTTPS
      // sameSite: strict - only send over HTTPS
      res.cookie('accessToken', user.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: convertToMillisencods(envs.COOKIE_EXPIRES_ACCESS_TOKEN),
      })

      res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: convertToMillisencods(envs.COOKIE_EXPIRES_REFRESH_TOKEN),
      })

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user,
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      await this.authRepository.logout(req)

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })

      return res.status(200).json({ message: 'Has cerrado sesión exitosamente' })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  profile = async (req: Request, res: Response) => {
    try {
      const user = req.body.user
      return res.status(200).json(user)
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  changePassword = async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = ZodAuthAdapter.validateChangePassword(req.body)

      const user = await this.authRepository.getUserById(req.body.user.user_id)

      if (!user) {
        throw CustomError.notFound('Usuario no encontrado')
      }

      const isPasswordValid = await BcryptAdapter.compare(oldPassword, user.password)
      if (!isPasswordValid) {
        throw CustomError.badRequest('La contraseña actual es incorrecta')
      }

      const hashedNewPassword = await BcryptAdapter.hash(newPassword)

      const updatedUser = await this.authRepository.changePassword(user.user_id, hashedNewPassword)

      if (!updatedUser) {
        throw CustomError.internalServer('Error al actualizar la contraseña')
      }

      res.status(200).json({
        message: 'Contraseña actualizada exitosamente',
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Error interno del servidor' })
      console.error(error)
    }
  }

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = ZodAuthAdapter.validateForgotPassword(req.body)

      const user = await this.authRepository.getUserByEmail(email)
      if (!user) {
        throw CustomError.notFound('Usuario no encontrado')
      }

      const resetToken = await this.authRepository.generatePasswordResetToken(user.user_id)

      await this.authRepository.savePasswordResetToken(user.user_id, resetToken)

      res.status(200).json({
        message: 'Solicitud de recuperación de contraseña exitosa. Por favor revisa tu correo o SMS para el token de recuperación.',
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Error interno del servidor' })
      console.error(error)
    }
  }

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = ZodAuthAdapter.validateResetPassword(req.body)

      // Verificar el token y obtener el `user_id`
      const userId = await this.authRepository.verifyPasswordResetToken(token)
      if (!userId) {
        throw CustomError.badRequest('Token de recuperación inválido o expirado')
      }

      // Hashear la nueva contraseña
      const hashedNewPassword = await BcryptAdapter.hash(newPassword)

      // Actualizar la contraseña del usuario
      const updatedUser = await this.authRepository.changePassword(userId, hashedNewPassword)

      if (!updatedUser) {
        throw CustomError.internalServer('Error al actualizar la contraseña')
      }

      res.status(200).json({
        message: 'Contraseña restablecida exitosamente',
      })
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json({ message: 'Error interno del servidor' })
      console.error(error)
    }
  }
}
