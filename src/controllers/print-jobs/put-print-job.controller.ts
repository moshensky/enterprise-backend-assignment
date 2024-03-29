import { NextFunction, Request } from 'express'
import { AuthResponse } from '../../request-handlers/authenticate'
import { canAccessJob } from './can-access-job'
import { getPrintJob, upsertPrintJob } from './print-jobs.dao'
import { CanceledPrintJob } from './print-jobs.types'

export async function putPrintJobController(
  request: Request,
  response: AuthResponse,
  next: NextFunction,
): Promise<void> {
  const { userId, isAdmin } = response.locals.token
  const jobId = request.params.id
  try {
    const job = await getPrintJob(jobId)
    if (job === undefined || job.state !== 'waiting') {
      response.status(404).json({
        code: 404,
        message: `Missing 'waiting' job(${jobId})`,
      })
      return
    }

    if (canAccessJob(job, userId, isAdmin)) {
      const canceledJob: CanceledPrintJob = {
        ...job,
        state: 'canceled',
        canceledAt: new Date().toISOString(),
        canceledByUserId: userId,
      }
      await upsertPrintJob(canceledJob)
      response.json(canceledJob)
    } else {
      response.status(403).json({
        code: 403,
        message: `You are not authorized to access job(${jobId})`,
      })
    }
  } catch (error) {
    next(error)
  }
}
