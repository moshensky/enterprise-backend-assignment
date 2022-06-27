import supertest from 'supertest'
import { db } from '../db'
import { createServer } from './express'

afterAll(() => db.destroy())

describe('createServer', () => {
  it('should add `health` route', async () => {
    const response = await supertest(createServer()).get('/health').expect(200)
    expect(response.body).toEqual({
      apiServer: 'up',
      db: 'up',
    })
  })
})
