export function convertToMillisencods(value: string): number {
  const time = parseInt(value.slice(0, -1)) // numeric value
  const unit = value.slice(-1) // (d, h, m, s)

  switch (unit) {
    case 'd':
      return time * 24 * 60 * 60 * 1000
    case 'h':
      return time * 60 * 60 * 1000
    case 'm':
      return time * 60 * 1000
    case 's':
      return time * 1000
    default:
      throw new Error(`Unit not supported: ${unit}`)
  }
}

export function convertToSeconds(value: string): number {
  const time = parseInt(value.slice(0, -1)) // nuemric value
  const unit = value.slice(-1) // time unit (d, h, m, s)

  switch (unit) {
    case 'd':
      return time * 24 * 60 * 60
    case 'h':
      return time * 60 * 60
    case 'm':
      return time * 60
    case 's':
      return time
    default:
      throw new Error(`Unit not supported: ${unit}`)
  }
}