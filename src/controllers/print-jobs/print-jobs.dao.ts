import { createWaitingPrintJob } from './print-jobs.stubs'
import { PrintJob, UUID } from './print-jobs.types'

const fakeJob: PrintJob = createWaitingPrintJob()

export async function getPrintJobs(): Promise<{ jobs: ReadonlyArray<PrintJob> }> {
  return { jobs: [] }
}

export async function upsertPrintJob(job: PrintJob): Promise<void> {
  console.log(job)
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
