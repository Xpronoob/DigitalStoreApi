import { Request } from "express"
import { AuthDatasource } from "../datasources/auth.datasource"

export class AuthRepository {
  constructor(private readonly authDatasource: AuthDatasource) {}
  
  async register(validatedData: any) {
    return await this.authDatasource.register(validatedData)
  }

  async login(validatedData: any) {
    return await this.authDatasource.login(validatedData)
  }

  async logout(req: Request) {
    return await this.authDatasource.logout(req)
  }

  async profile(req: Request) {
    return await this.authDatasource.profile(req)
  }
}