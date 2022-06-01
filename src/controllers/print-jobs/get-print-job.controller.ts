import { NextFunction, Request, Response } from 'express'
import { getPrintJob } from './print-jobs.dao'

export async function getPrintJobController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const job = await getPrintJob(request.params.id)
    if (job) {
      response.json(job)
    } else {
      response.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
}
