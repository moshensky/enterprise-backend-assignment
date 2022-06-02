import request from 'supertest'
import { jwtToken, server } from '../../test-utils'
import { postPrintJobController } from './post-print-job.controller'
import { upsertPrintJob } from './print-jobs.dao'
import { createWaitingPrintJob } from './print-jobs.stubs'

// Mock DAO module
jest.mock('./print-jobs.dao')
const upsertPrintJobMock = jest.mocked(upsertPrintJob)

describe('postPrintJobController', () => {
  // Define route under test
  const route = '/print-jobs'

  // Spin up http server
  const app = server((app) => {
    // Setup endpoint
    app.post(route, postPrintJobController)
  })

  it('should get jobs when admin', async () => {
    const job = {
      ...createWaitingPrintJob(),
      createdByUserId: jwtToken.regular.userId,
    }
    // Setup mocks
    // Send request and expect response
    const response = await request(app)
      .post(route)
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .send({
        label: job.label,
        copies: job.copies,
      })
      .expect(201)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toMatchObject({
      ...job,
      id: expect.any(String),
      createdAt: expect.any(String),
    })
    // Expect data access function to be called
    expect(upsertPrintJobMock).toHaveBeenCalled()
  })
})
