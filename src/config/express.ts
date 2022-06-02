import express, { Application } from 'express'
import cors from 'cors'
import { printJobsRoute } from '../controllers/print-jobs/print-jobs.router'
import { validateViaOpenapi } from '../request-handlers/openapi'
import { sendErrorResponse } from '../request-handlers/error-handler'
import { logRequest } from '../request-handlers/log-request'
import { healthController } from '../controllers/health/health.controller'

export const createServer = (): Application => {
  const app = express()
  app.use(logRequest(true))
  app.use(cors())
  app.use(express.json({ limit: '1mb' }))
  app.disable('x-powered-by')
  app.use(validateViaOpenapi)

  app.use('/health', healthController)
  app.use('/print-jobs', printJobsRoute)

  app.use(sendErrorResponse)

  return app
}
