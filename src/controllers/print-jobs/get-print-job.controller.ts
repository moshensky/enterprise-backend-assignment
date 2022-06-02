import { NextFunction, Request, Response } from 'express'
import { canAccessJob } from './can-access-job'
import { getPrintJob } from './print-jobs.dao'

export async function getPrintJobController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { userId, isAdmin } = response.locals.token
  const jobId = request.params.id
  try {
    const job = await getPrintJob(jobId)
    if (job === undefined) {
      response.status(404).json({
        code: 404,
        message: `Job(${jobId}) not found`,
      })
      return
    }

    if (canAccessJob(job, userId, isAdmin)) {
      response.json(job)
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
