import { Router } from 'express'
import { ExpressAdapter } from '../adapters/express.adapter'
import { AppRoutes } from '../routes/app.routes'
import { envs } from './envs.config'

interface Options {
  port: number
  routes: Router
}

export class Server {
  constructor(options: Options) {}
  async start() {
    new ExpressAdapter({
      port: envs.PORT,
      routes: AppRoutes.routes,
    }).start()
  }
}
