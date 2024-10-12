import { Request, Response } from "express"

export class AuthDatasource {

  async register() {
    console.log("using register datasource")
  }

  async login() {
    console.log("using login datasource")
  }

  async logout() {
    console.log("using logout datasource")
  }

}