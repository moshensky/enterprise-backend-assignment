import { CanceledPrintJob, NewPrintJob, PrintJob, UUID, WaitingPrintJob } from './print-jobs.types'
import { v4 as uuid } from 'uuid'

const fakeJob: PrintJob = {
  label: {
    type: 'request-label',
    requestCreatedAt: '2022-11-23T12:34:23Z',
    requestNumber: 'RA34',
  },
  copies: 2,
  id: uuid(),
  state: 'waiting',
  createdByUserId: 'Mock user',
  createdAt: new Date().toISOString(),
}

export async function getPrintJobs(): Promise<{ jobs: ReadonlyArray<PrintJob> }> {
  return { jobs: [] }
}

export async function addPrintJob(
  job: NewPrintJob,
  createdByUserId: UUID,
): Promise<WaitingPrintJob> {
  return {
    ...job,
    id: uuid(),
    state: 'waiting',
    createdByUserId,
    createdAt: new Date().toISOString(),
  }
}

export async function getPrintJob(jobId: UUID): Promise<PrintJob | undefined> {
  return {
    ...fakeJob,
    id: jobId,
  }
}

export async function deletePrintJob(jobId: UUID): Promise<boolean> {
  console.log(jobId)
  return Promise.resolve(false)
}

export async function cancelPrintJob(
  jobId: UUID,
  canceledByUserId: UUID,
): Promise<CanceledPrintJob | undefined> {
  return {
    ...fakeJob,
    state: 'canceled',
    id: jobId,
    canceledAt: new Date().toISOString(),
    canceledByUserId,
  }
}
