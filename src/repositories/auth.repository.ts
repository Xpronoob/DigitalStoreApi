import { AuthDatasource } from "../datasources/auth.datasource"

export class AuthRepository {
  constructor(private readonly authDatasource: AuthDatasource) {}
  
  async register(validatedData: any) {
    return await this.authDatasource.register(validatedData)
  }

  async login() {
    return await this.authDatasource.login()
  }

  async logout() {
    return await this.authDatasource.logout()
  }
}