import { createServer } from './config/express'
import http from 'http'

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '5000'

const startServer = async () => {
  const app = await createServer()
  const server = http.createServer(app).listen({ host, port }, () => {
    const addressInfo = server.address()
    /* c8 ignore next */
    if (addressInfo === null) {
      console.log('Server not ready or stopped')
      /* c8 ignore next */
    } else if (typeof addressInfo === 'string') {
      console.log(`Server ready at ${addressInfo}`)
    } else {
      console.log(`Server ready at http://${addressInfo.address}:${addressInfo.port}`)
    }

    const signalTraps: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2']
    signalTraps.forEach((ev) => {
      process.once(ev, () => server.close(() => console.log(`HTTP server closed (${ev})`)))
    })
  })
}

startServer()
