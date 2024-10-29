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

  async getUserByEmail(email: string) {
    return await this.authDatasource.getUserByEmail(email)
  }

  async generatePasswordResetToken(userId: number) {
    return await this.authDatasource.generatePasswordResetToken(userId)
  }

  async savePasswordResetToken(userId: number, token: string) {
    return await this.authDatasource.savePasswordResetToken(userId, token)
  }

  async verifyPasswordResetToken(token: string) {
    return await this.authDatasource.verifyPasswordResetToken(token)
  }
}
