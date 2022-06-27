import { Knex } from 'knex'
import { PrintJob, PrintJobDB } from '../../controllers/print-jobs/print-jobs.types'

const regularUser1 = '62084f00-8fdd-410c-800c-d06ee3258894'
const regularUser2 = 'b5b30c42-0eaf-4472-a5b0-31e8c1ba5f61'

const jobs: ReadonlyArray<PrintJob> = [
  {
    label: {
      type: 'request-label',
      requestCreatedAt: '2022-11-23T12:34:23Z',
      requestNumber: 'RA34',
    },
    copies: 2,
    id: 'cbf8847a-e70a-44ee-bac7-12f28430b81c',
    state: 'waiting',
    createdByUserId: regularUser1,
    createdAt: '2022-06-02T06:23:17.404Z',
  },
  {
    label: {
      type: 'request-label',
      requestCreatedAt: '2022-11-23T12:34:23Z',
      requestNumber: 'RN334',
    },
    copies: 3,
    id: 'ac09bffd-8fc7-4a07-91c5-4068f59d9fe7',
    state: 'waiting',
    createdByUserId: regularUser2,
    createdAt: '2022-06-02T06:33:33.404Z',
  },
  {
    label: {
      type: 'request-label',
      requestCreatedAt: '2022-11-23T12:34:23Z',
      requestNumber: 'RA34',
    },
    copies: 2,
    id: 'f5dfe977-7d7a-4e85-baca-a8851e1ce798',
    state: 'completed',
    createdByUserId: regularUser1,
    completedAt: '2022-06-02T09:32:17.404Z',
    startedAt: '2022-06-02T09:30:17.404Z',
    createdAt: '2022-06-02T09:23:17.404Z',
  },
]

const dbJobs: PrintJobDB[] = jobs.map((data) => ({
  id: data.id,
  data: JSON.stringify(data),
}))

export async function seed(knex: Knex): Promise<void> {
  await knex('print_jobs').truncate()
  await knex('print_jobs').insert(dbJobs)
}
