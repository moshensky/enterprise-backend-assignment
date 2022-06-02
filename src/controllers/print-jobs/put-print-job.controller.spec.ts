import request from 'supertest'
import { jwtToken, server } from '../../test-utils'
import { createCanceledPrintJob, createWaitingPrintJob } from './print-jobs.stubs'
import { putPrintJobController } from './put-print-job.controller'
import { getPrintJob } from './print-jobs.dao'
import { v4 as uuid } from 'uuid'

// Mock DAO module
jest.mock('./print-jobs.dao')
const getPrintJobMock = jest.mocked(getPrintJob)

describe('putPrintJobController', () => {
  // Define route under test
  const route = '/print-jobs/:id/cancel'

  // Spin up http server
  const app = server((app) => {
    // Setup endpoint
    app.put(route, putPrintJobController)
  })

  describe('user which can view and modify only own jobs', () => {
    it('should cancel job when it is in `waiting` state', async () => {
      const job = {
        ...createWaitingPrintJob(),
        createdByUserId: jwtToken.regular.userId,
      }
      // Setup mocks
      getPrintJobMock.mockResolvedValue(job)
      // Send request and expect response
      const response = await request(app)
        .put(route.replace(':id', job.id))
        .auth(jwtToken.regular.token, { type: 'bearer' })
        .send()
        .expect(200)
      // Expect response body
      expect(response).toHaveProperty('body')
      expect(response.body).toMatchObject({
        ...job,
        state: 'canceled',
        canceledByUserId: job.createdByUserId,
        canceledAt: expect.any(String),
      })
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
        .put(route.replace(':id', jobId))
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
  })

  describe('user which can view and modify all jobs', () => {
    it('should cancel job when it is in `waiting` state and created by another user', async () => {
      const job = createWaitingPrintJob()
      // Setup mocks
      getPrintJobMock.mockResolvedValue(job)
      // Send request and expect response
      const response = await request(app)
        .put(route.replace(':id', job.id))
        .auth(jwtToken.admin.token, { type: 'bearer' })
        .send()
        .expect(200)
      // Expect response body
      expect(response).toHaveProperty('body')
      expect(response.body).toMatchObject({
        ...job,
        state: 'canceled',
        canceledByUserId: jwtToken.admin.userId,
        canceledAt: expect.any(String),
      })
    })
  })

  it('should reject invalid id', async () => {
    const jobId = 'invalid-id'
    getPrintJobMock.mockResolvedValue(undefined)
    const response = await request(app)
      .put(route.replace(':id', jobId))
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .expect(400)
    // TODO: figure out why 400 for params are not serialized as json
    // expect(response).toHaveProperty('body.message', 'request.params.id should match format "uuid"')
    expect(response.text).toContain('request.params.jobId should match format &quot;uuid&quot;')
    expect(getPrintJobMock).not.toHaveBeenCalled()
  })

  it('should return 404 when job state != `waiting`', async () => {
    const job = {
      ...createCanceledPrintJob(),
      createdByUserId: jwtToken.regular.userId,
    }
    // Setup mocks
    getPrintJobMock.mockResolvedValue(job)
    // Send request and expect response
    const response = await request(app)
      .put(route.replace(':id', job.id))
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .send()
      .expect(404)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual({
      code: 404,
      message: `Missing 'waiting' job(${job.id})`,
    })
  })

  it('should return 404 when job with sent jobId does not exists', async () => {
    // Setup mocks
    getPrintJobMock.mockResolvedValue(undefined)
    const jobId = uuid()
    // Send request and expect response
    const response = await request(app)
      .put(route.replace(':id', jobId))
      .auth(jwtToken.regular.token, { type: 'bearer' })
      .send()
      .expect(404)
    // Expect response body
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual({
      code: 404,
      message: `Missing 'waiting' job(${jobId})`,
    })
  })
})
