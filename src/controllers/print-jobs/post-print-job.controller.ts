import { NextFunction, Request, Response } from 'express'
import { addPrintJob } from './print-jobs.dao'

export async function postPrintJobController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const job = await addPrintJob(request.body, 'fake user id')
    if (job) {
      response.status(201).json(job)
    } else {
      response.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
}
