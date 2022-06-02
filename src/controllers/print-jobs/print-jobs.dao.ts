import { db } from '../../db'
import { PrintJob, PrintJobDB, UUID } from './print-jobs.types'

export async function getPrintJobs(): Promise<{ jobs: ReadonlyArray<PrintJob> }> {
  const results = await db.table<PrintJobDB>('print_jobs').select('*')
  return {
    jobs: results.map(({ data }) => JSON.parse(data)),
  }
}

export async function upsertPrintJob(job: PrintJob): Promise<void> {
  await db.table<PrintJobDB>('print_jobs').upsert([job])
}

export async function getPrintJob(jobId: UUID): Promise<PrintJob | undefined> {
  const result = await db.table<PrintJobDB>('print_jobs').where('id', jobId).first()
  if (result) {
    return JSON.parse(result.data)
  }

  return undefined
}

export async function deletePrintJob(jobId: UUID): Promise<boolean> {
  const deletedRowCount = await db.table<PrintJobDB>('print_jobs').where('id', jobId).delete()
  return deletedRowCount !== 0
}
