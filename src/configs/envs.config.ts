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

export const parseToString = (text: string | undefined) => {
  text ? (text = text.toString()) : (text = '')
  return text
}

export const envs = {
  PORT: getPort(),
  FRONTEND_URL: getFrontUrl(),
  DEBUG_MODE: getDebugMode(),
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN || '',
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN || '',
  JWT_EXPIRES_ACCESS_TOKEN: process.env.JWT_EXPIRES_ACCESS_TOKEN || '1m',
  JWT_EXPIRES_REFRESH_TOKEN: process.env.JWT_EXPIRES_REFRESH_TOKEN || '120d',
  JWT_PASSWORD_RESET_TOKEN: process.env.JWT_PASSWORD_RESET_TOKEN || '',
  RESET_PASSWORD_TOKEN_EXPIRES: process.env.RESET_PASSWORD_TOKEN_EXPIRES || '6h',
  PAYPAL_CLIENT_ID: parseToString(process.env.PAYPAL_CLIENT_ID),
  PAYPAL_CLIENT_SECRET: parseToString(process.env.PAYPAL_CLIENT_SECRET),
  PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com',
}
