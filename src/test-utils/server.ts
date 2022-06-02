import express, { Express } from 'express'
import { authenticate } from '../request-handlers/authenticate'
import { sendErrorResponse } from '../request-handlers/error-handler'
import { logRequest } from '../request-handlers/log-request'
import { validateViaOpenapi } from '../request-handlers/openapi'

export function server(configure: (express: Express) => void): Express {
  const app = express()
  app.use(logRequest(false))
  app.use(authenticate)
  app.use(express.json({ limit: '1mb' }))
  app.use(validateViaOpenapi)
  configure(app)
  app.use(sendErrorResponse)
  return app
}
