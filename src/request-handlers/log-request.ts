import { Request } from 'express'
import pino from 'express-pino-logger'
import { config } from '../config/config'

export const logRequest = (enabled: boolean) =>
  pino({
    level: config.logLevel,
    enabled,
    serializers: {
      // TODO: improve by preventing logging of Authorization header only
      // Prevent request header logging
      req: (request: Request) => ({
        method: request.method,
        url: request.url,
      }),
    },
  })
