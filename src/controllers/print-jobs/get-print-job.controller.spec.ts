import request from 'supertest'
import { jwtToken, server } from '../../test-utils'
import { getPrintJobController } from './get-print-job.controller'
import { getPrintJob } from './print-jobs.dao'
import { createWaitingPrintJob } from './print-jobs.stubs'

// Mock DAO module
jest.mock('./print-jobs.dao')
const getPrintJobMock = jest.mocked(getPrintJob)

describe('getPrintJobController', () => {
  // Define route under test
  const route = '/print-jobs/:id'

  // Spin up http server
  const app = server((app) => {
    // Setup endpoint
    app.get(route, getPrintJobController)
  })

  it('should get own job', async () => {
    const job = {
      ...createWaitingPrintJob(),
      createdByUserId: jwtToken.regular.userId,
    }
    // Setup mocks
    getPrintJobMock.mockResolvedValue(job)
    // Send request and expect response
    const response = await request(app)
      .get(route.replace(':id', job.id))
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .send()
      .expect(200)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual(job)
    // Expect data access function to be called
    expect(getPrintJobMock).toHaveBeenCalledWith(job.id)
  })

  it.todo(`should get someone else's job when admin`)
  it.todo(`should return 403 when regular user accesses someone else's job`)
  it.todo('should return 404 for unknown job')
})
