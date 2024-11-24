import multer, { StorageEngine, FileFilterCallback } from 'multer'
import { Request } from 'express'

const storageDisk: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/')
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const storageBuffer: StorageEngine = multer.memoryStorage()

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos JPEG y PNG'))
  }
}

const upload = multer({
  storage: storageBuffer,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
})

export const uploadSingle = (fieldName: string) => upload.single(fieldName)
export const array = (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount)
