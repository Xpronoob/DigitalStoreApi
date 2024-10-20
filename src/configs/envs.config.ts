export const getPort = () => {
  if (!process.env.PORT) return 3000
  return parseInt(process.env.PORT)
}

export const getFrontUrl = () => {
  const frontUrl = process.env.FRONTEND_URL
  return frontUrl || 'http://localhost:5173'
}

export const getDebugMode = () => {
  const debugMode = process.env.DEBUG_MODE?.toLowerCase()

  if (debugMode === 'true') {
    return true
  }

  return false
}

export const envs = {
  PORT: getPort(),
  FRONTEND_URL: getFrontUrl(),
  DEBUG_MODE: getDebugMode(),
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN || '',
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN || '',
  COOKIE_EXPIRES_ACCESS_TOKEN: process.env.COOKIE_EXPIRES_ACCESS_TOKEN || '1m',
  COOKIE_EXPIRES_REFRESH_TOKEN:
    process.env.COOKIE_EXPIRES_REFRESH_TOKEN || '120d',
}
