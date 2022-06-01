import express, { Application } from 'express'
import cors from 'cors'

export const createServer = (): Application => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.disable('x-powered-by')
  app.get('/health', (_req, res) => res.send('UP'))

  return app
}
