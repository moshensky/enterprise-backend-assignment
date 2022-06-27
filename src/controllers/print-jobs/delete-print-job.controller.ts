import { NextFunction, Request, Response } from 'express'
import { deletePrintJob } from './print-jobs.dao'

export async function deletePrintJobController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { isAdmin } = response.locals.token
  if (isAdmin !== true) {
    response.status(403).json({
      code: 403,
      message: 'You are not authorized to delete jobs',
    })
    return
  }

  const jobId = request.params.id
  try {
    const isDeleted = await deletePrintJob(jobId)
    if (isDeleted) {
      response.sendStatus(204)
    } else {
      response.status(404).json({
        code: 404,
        message: `Job(${jobId}) not found`,
      })
    }
  } catch (error) {
    next(error)
  }
}
