import express, { Application } from 'express'
import cors from 'cors'

import { printJobsRoute } from '../controllers/print-jobs/print-jobs.router'

export const createServer = (): Application => {
  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '1mb' }))
  app.disable('x-powered-by')

  app.use('/print-jobs', printJobsRoute)

  app.get('/health', (_req, res) => res.send('UP'))

  return app
}
