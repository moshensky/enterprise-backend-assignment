import { NextFunction, Request, Response } from 'express'
import { deletePrintJob } from './print-jobs.dao'

export async function deletePrintJobController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const isDeleted = await deletePrintJob(request.params.id)
    if (isDeleted) {
      response.sendStatus(204)
    } else {
      response.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
}
