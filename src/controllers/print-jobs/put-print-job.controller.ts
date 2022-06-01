import { NextFunction, Request, Response } from 'express'
import { cancelPrintJob } from './print-jobs.dao'

export async function putPrintJobController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const job = await cancelPrintJob(request.params.id, 'fake user id')
    if (job) {
      response.json(job)
    } else {
      response.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
}
