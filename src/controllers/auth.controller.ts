import { Request, Response } from "express"
import { AuthRepository } from "../repositories/auth.repository"

export class AuthController{
  //DI
  constructor(private readonly authRepository: AuthRepository) {}

  login = (req: Request, res: Response) => {
     this.authRepository.login()
  }

  register = (req: Request, res: Response) => {
    this.authRepository.register()
  }

  logout = (req: Request, res: Response) => {
    this.authRepository.logout()
  }
}