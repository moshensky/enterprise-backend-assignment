import { NextFunction, Request, Response } from 'express'
import { getPrintJobs } from './print-jobs.dao'

export async function getPrintJobsController(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await getPrintJobs()
    response.json(data)
  } catch (error) {
    next(error)
  }
}
