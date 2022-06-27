import request from 'supertest'
import { jwtToken, server } from '../../test-utils'
import { getPrintJobsController } from './get-print-jobs.controller'
import { getPrintJobs } from './print-jobs.dao'
import { createCanceledPrintJob, createWaitingPrintJob } from './print-jobs.stubs'

// Mock DAO module
jest.mock('./print-jobs.dao')
const getPrintJobsMock = jest.mocked(getPrintJobs)

describe('getPrintJobsController', () => {
  // Define route under test
  const route = '/print-jobs'

  // Spin up http server
  const app = server((app) => {
    // Setup endpoint
    app.get(route, getPrintJobsController)
  })

  it('should get jobs when admin', async () => {
    const jobs = { jobs: [createWaitingPrintJob(), createCanceledPrintJob()] }
    // Setup mocks
    getPrintJobsMock.mockResolvedValue(jobs)
    // Send request and expect response
    const response = await request(app)
      .get(route)
      .auth(jwtToken.admin.token, { type: 'bearer' })
      .send()
      .expect(200)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual(jobs)
    // Expect data access function to be called
    expect(getPrintJobsMock).toHaveBeenCalled()
  })

  it('should return 403 when regular user', async () => {
    // Send request and expect response
    const response = await request(app)
      .get(route)
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .send()
      .expect(403)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual({
      code: 403,
      message: 'You are not authorized to list jobs',
    })
    // Expect data access function to be called
    expect(getPrintJobsMock).not.toHaveBeenCalled()
  })
})
