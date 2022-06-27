import request from 'supertest'
import { jwtToken, server } from '../../test-utils'
import { getPrintJobController } from './get-print-job.controller'
import { getPrintJob } from './print-jobs.dao'
import { createWaitingPrintJob } from './print-jobs.stubs'
import { v4 as uuid } from 'uuid'

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

  it(`should get someone else's job when admin`, async () => {
    const job = {
      ...createWaitingPrintJob(),
      createdByUserId: jwtToken.regular.userId,
    }
    // Setup mocks
    getPrintJobMock.mockResolvedValue(job)
    // Send request and expect response
    const response = await request(app)
      .get(route.replace(':id', job.id))
      .auth(jwtToken.admin.token, { type: 'bearer' })
      .send()
      .expect(200)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual(job)
    // Expect data access function to be called
    expect(getPrintJobMock).toHaveBeenCalledWith(job.id)
  })

  it(`should return 403 when regular user accesses someone else's job`, async () => {
    const jobId = uuid()
    const job = {
      ...createWaitingPrintJob(),
      id: jobId,
    }
    // Setup mocks
    getPrintJobMock.mockResolvedValue(job)
    // Send request and expect response
    const response = await request(app)
      .get(route.replace(':id', jobId))
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .send()
      .expect(403)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual({
      code: 403,
      message: `You are not authorized to access job(${jobId})`,
    })
  })

  it('should return 404 for unknown job', async () => {
    // Setup mocks
    getPrintJobMock.mockResolvedValue(undefined)
    const jobId = uuid()
    // Send request and expect response
    const response = await request(app)
      .get(route.replace(':id', jobId))
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .send()
      .expect(404)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual({
      code: 404,
      message: `Job(${jobId}) not found`,
    })
  })
})
