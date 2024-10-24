import { Request } from 'express'
import { AuthDatasource } from '../datasources/auth.datasource'
import { UserAgentEntity } from '../entities/user-agent.entity'

export class AuthRepository {
  constructor(private readonly authDatasource: AuthDatasource) {}

  async register(validatedData: any, userAgentInfo: UserAgentEntity) {
    return await this.authDatasource.register(validatedData, userAgentInfo)
  }

  async login(validatedData: any, userAgentInfo: UserAgentEntity) {
    return await this.authDatasource.login(validatedData, userAgentInfo)
  }

  async logout(req: Request) {
    return await this.authDatasource.logout(req)
  }

  async profile(req: Request) {
    return await this.authDatasource.profile(req)
  }

  async getUserById(userId: string) {
    return await this.authDatasource.getUserById(userId)
  }

  async changePassword(userId: number, hashedPassword: string) {
    return await this.authDatasource.changePassword(userId, hashedPassword)
  }
}
