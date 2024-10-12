

  export const getPort = () => {
    if(!process.env.PORT) return 3000
    return parseInt(process.env.PORT)
  }

  export const getFrontUrl = () => {
    const frontUrl = process.env.FRONTEND_URL
    return frontUrl || 'http://localhost:5173'
  }

  export const getDebugMode = () => {
    const debugMode = process.env.DEBUG_MODE?.toLowerCase()
    
    if(debugMode === "true") {
      return true
    }

    return false
  }
