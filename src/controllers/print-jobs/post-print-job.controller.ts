import { v4 as uuid } from 'uuid'
import { NextFunction, Request, Response } from 'express'
import { upsertPrintJob } from './print-jobs.dao'
import { WaitingPrintJob } from './print-jobs.types'

export async function postPrintJobController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const userId = 'fake user id'
  try {
    const job: WaitingPrintJob = {
      id: uuid(),
      label: request.body.label,
      copies: request.body.copies,
      state: 'waiting',
      createdAt: new Date().toISOString(),
      createdByUserId: userId,
    }
    await upsertPrintJob(job)
    response.status(201).json(job)
  } catch (error) {
    next(error)
  }
}
