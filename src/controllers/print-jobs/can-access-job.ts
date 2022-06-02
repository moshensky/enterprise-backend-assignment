import { PrintJob, UUID } from './print-jobs.types'

export const canAccessJob = (job: PrintJob, userId: UUID, isAdmin?: boolean) =>
  job.createdByUserId === userId || isAdmin
