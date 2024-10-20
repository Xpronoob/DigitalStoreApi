import UAParser from 'ua-parser-js'

/*
    {
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      browser: { name: 'Chrome', version: '130.0.0.0', major: '130' },
      engine: { name: 'Blink', version: '130.0.0.0' },
      os: { name: 'Windows', version: '10' },
      device: { vendor: undefined, model: undefined, type: undefined },
      cpu: { architecture: 'amd64' }
    }
  */
export class UAParserAdapter {
  static createUAParser = (userAgent: string) => {
    return new UAParser(userAgent)
  }

  static parserResults(userAgent: string) {
    const agent = UAParserAdapter.createUAParser(userAgent)
    const result = agent.getResult()
    return result
  }
}
