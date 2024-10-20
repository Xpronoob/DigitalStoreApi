import express, { Router } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { envs } from '../configs/envs.config'

interface Options {
  port: number
  routes: Router
}

export class ExpressAdapter {
  public readonly app = express()
  private readonly port: number
  private readonly routes: Router

  constructor(options: Options) {
    const { port, routes } = options
    this.port = port
    this.routes = routes
  }

  async start(): Promise<void> {
    const corsOptions: cors.CorsOptions = {
      origin: [envs.FRONTEND_URL],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true, // Allow sending cookies
      allowedHeaders: ['Content-Type', 'Authorization'],
    }

    this.app.use(express.json())
    this.app.use(morgan('dev'))
    this.app.use(cookieParser())
    this.app.use(cors(corsOptions))

    this.app.use(this.routes)

    this.app.listen(this.port, () => {
      console.log(`Server is running on localhost:${this.port}`)
    })
  }
}
