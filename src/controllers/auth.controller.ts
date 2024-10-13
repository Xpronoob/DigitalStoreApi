import { Request, Response } from "express"
import { AuthRepository } from "../repositories/auth.repository"
import { ZodAdapter } from "../adapters/zod.adapter"
import { CustomError } from "../errors/custom.error"
import { BcryptAdapter } from "../adapters/bcrypt.adapter"
import { convertToMillisencods } from "../utils/converters"
import { envs } from "../configs/envs"

export class AuthController{
  //DI
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  login = (req: Request, res: Response) => {
     this.authRepository.login()
  }

  register = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodAdapter.validateRegister(req.body)
      validatedData.password = BcryptAdapter.hash(validatedData.password)
      const user = await this.authRepository.register(validatedData)
      if (!user) throw CustomError.internalServer("Error al registrar el usuario")
      
      // Save Access Token & Refresh Token in cookie
      // httpOnly: true - not accesible from JavaScript
      // secure: true - only send over HTTPS
      // sameSite: strict - only send over HTTPS
      res.cookie('accessToken', user.accessToken, {
        httpOnly: true,
        secure: true,
      })

      res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: convertToMillisencods(envs.COOKIE_EXPIRES_REFRESH_TOKEN),
      })

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }

  logout = (req: Request, res: Response) => {
    this.authRepository.logout()
  }
}