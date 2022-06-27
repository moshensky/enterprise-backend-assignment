import request from 'supertest'
import { jwtToken, server } from '../../test-utils'
import { deletePrintJobController } from './delete-print-job.controller'
import { deletePrintJob } from './print-jobs.dao'
import { v4 as uuid } from 'uuid'

// Mock DAO module
jest.mock('./print-jobs.dao')
const deletePrintJobMock = jest.mocked(deletePrintJob)

describe('deletePrintJobController', () => {
  // Define route under test
  const route = '/print-jobs/:id'

  // Spin up http server
  const app = server((app) => {
    // Setup endpoint
    app.delete(route, deletePrintJobController)
  })

  it('should return 403 when user is not admin', async () => {
    const jobId = uuid()
    // Send request and expect response
    const response = await request(app)
      .delete(route.replace(':id', jobId))
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .send()
      .expect(403)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual({
      code: 403,
      message: 'You are not authorized to delete jobs',
    })
    expect(deletePrintJobMock).not.toBeCalled()
  })

  it('should delete job', async () => {
    const jobId = uuid()
    // Setup mocks
    deletePrintJobMock.mockResolvedValue(true)
    // Send request and expect response
    const response = await request(app)
      .delete(route.replace(':id', jobId))
      .auth(jwtToken.admin.token, { type: 'bearer' })
      .send()
      .expect(204)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual({})
    // Expect data access function to be called
    expect(deletePrintJobMock).toHaveBeenCalledWith(jobId)
  })

  it('should return 404 for unknown jobId', async () => {
    const jobId = uuid()
    // Setup mocks
    deletePrintJobMock.mockResolvedValue(false)
    // Send request and expect response
    const response = await request(app)
      .delete(route.replace(':id', jobId))
      .auth(jwtToken.admin.token, { type: 'bearer' })
      .send()
      .expect(404)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual({
      code: 404,
      message: `Job(${jobId}) not found`,
    })
    // Expect data access function to be called
    expect(deletePrintJobMock).toHaveBeenCalledWith(jobId)
  })
})
