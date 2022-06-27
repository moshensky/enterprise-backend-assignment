import { NextFunction, Request } from 'express'
import { AuthResponse } from '../../request-handlers/authenticate'
import { getPrintJobs } from './print-jobs.dao'

export async function getPrintJobsController(
  _request: Request,
  response: AuthResponse,
  next: NextFunction,
): Promise<void> {
  const { isAdmin } = response.locals.token
  if (isAdmin !== true) {
    response.status(403).json({
      code: 403,
      message: 'You are not authorized to list jobs',
    })
    return
  }

  try {
    const data = await getPrintJobs()
    response.json(data)
  } catch (error) {
    next(error)
  }
}
