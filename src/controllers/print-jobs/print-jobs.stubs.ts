import { v4 as uuid } from 'uuid'
import { CanceledPrintJob, WaitingPrintJob } from './print-jobs.types'

export const createWaitingPrintJob = (): WaitingPrintJob => ({
  label: {
    type: 'request-label',
    requestCreatedAt: '2022-11-23T12:34:23Z',
    requestNumber: 'RA34',
  },
  copies: 2,
  id: uuid(),
  state: 'waiting',
  createdByUserId: uuid(),
  createdAt: new Date().toISOString(),
})

export const createCanceledPrintJob = (): CanceledPrintJob => ({
  ...createWaitingPrintJob(),
  state: 'canceled',
  canceledAt: new Date().toISOString(),
  canceledByUserId: uuid(),
})
