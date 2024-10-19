import { Request, Response } from "express"
import { AuthRepository } from "../repositories/auth.repository"
import { ZodAuthAdapter } from "../adapters/zod.auth.adapter"
import { CustomError } from "../errors/custom.error"
import { BcryptAdapter } from "../adapters/bcrypt.adapter"
import { convertToMillisencods } from "../utils/converters.util"
import { envs } from "../configs/envs.config"

export class AuthController{
  //DI
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodAuthAdapter.validateAuthUser(req.body)
      validatedData.email = validatedData.email.toLowerCase()
      const user = await this.authRepository.login(validatedData)
      if (!user) throw CustomError.internalServer("Error al registrar el usuario")
      
      // Save Access Token & Refresh Token in cookie
      // httpOnly: true - not accesible from JavaScript
      // secure: true - only send over HTTPS
      // sameSite: strict - only send over HTTPS
      res.cookie('accessToken', user.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })

      res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: convertToMillisencods(envs.COOKIE_EXPIRES_REFRESH_TOKEN),
      })

      res.status(201).json({
        message: "Has iniciado sesión exitosamente",
        user,
      });
    } catch(error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      res.status(500).json(error)
      console.log(error)
    }
  }
  
  register = async (req: Request, res: Response) => {
    try {
      const validatedData = ZodAuthAdapter.validateAuthUser(req.body)
      validatedData.email = validatedData.email.toLowerCase()
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
        sameSite: "strict",
      })

      res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
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

  logout = async (req: Request, res: Response) => {
    try{
      await this.authRepository.logout(req)

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true, 
        sameSite: "strict",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true, 
        sameSite: "strict",
      });

      return res.status(200).json({ message: "Has cerrado sesión exitosamente" })

    }catch(error){
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
}