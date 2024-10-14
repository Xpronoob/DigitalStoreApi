import jwt from 'jsonwebtoken'
import { envs } from '../configs/envs.config';
import { convertToSeconds } from '../utils/converters.util';

export class JwtAdapter {
  
  static async generateAccessToken(
    payload: Object,
    duration: number = convertToSeconds(envs.COOKIE_EXPIRES_ACCESS_TOKEN),
  ): Promise<string | null> {
    return await new Promise(resolve => {
      jwt.sign(payload, envs.JWT_ACCESS_TOKEN, { expiresIn: duration }, (err, token) => {
        if (err != null) return resolve(null)

        resolve(token!) // '!' is non-null assertion \ not null, not undefined
      })
    })
  }

  static async generateRefreshToken(
    payload: Object,
    duration: number = convertToSeconds(envs.COOKIE_EXPIRES_REFRESH_TOKEN),
  ): Promise<string | null> {
    return await new Promise(resolve => {
      jwt.sign(payload, envs.JWT_REFRESH_TOKEN, { expiresIn: duration }, (err, token) => {
        if (err != null) return resolve(null)

        resolve(token!) // '!' is non-null assertion \ not null, not undefined
      })
    })
  }

  static async validateAccessToken<T>(token: string): Promise<T | null> {
    return await new Promise(resolve => {
      jwt.verify(token, envs.JWT_ACCESS_TOKEN, (err, decoded) => {
        // console.log(err)
        if (err?.message === 'jwt expired') return resolve({ expired: true } as T)
        if (err?.name === 'JsonWebTokenError') return resolve(null)

        resolve(decoded as T)
      })
    })
  }

  static async validateRefreshToken<T>(token: string): Promise<T | null> {
    return await new Promise(resolve => {
      jwt.verify(token, envs.JWT_REFRESH_TOKEN, (err, decoded) => {
        if (err?.message === 'jwt expired') return resolve({ expired: true } as T)
        if (err?.name === 'JsonWebTokenError') return resolve(null)

        resolve(decoded as T)
      })
    })
  }
}
