import sharp from 'sharp'
import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'

const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export const processImage = (directory: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if (!req.file) {
      //   return res.status(400).send({ error: 'No se proporcionó un archivo' })
      // }

      if (req.file) {
        const uploadsDir = path.join(__dirname, `../../uploads/${directory}`)
        ensureDirExists(uploadsDir)

        const fileName = `profile-${Date.now()}.webp`
        const filePath = path.join(uploadsDir, fileName)

        // await sharp(req.file.buffer).resize(200, 200).webp({ quality: 70 }).toFile(filePath)
        await sharp(req.file.buffer).webp({ quality: 70 }).toFile(filePath)

        req.file.filename = fileName
        req.file.path = filePath
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
