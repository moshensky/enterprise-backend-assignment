import supertest from 'supertest'
import { createServer } from './express'

describe('createServer', () => {
  it('should add `health` route', (done) => {
    supertest(createServer()).get('/health').expect('UP', done)
  })
})
