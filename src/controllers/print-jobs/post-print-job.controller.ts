import { v4 as uuid } from 'uuid'
import { NextFunction, Request } from 'express'
import { upsertPrintJob } from './print-jobs.dao'
import { WaitingPrintJob } from './print-jobs.types'
import { AuthResponse } from '../../request-handlers/authenticate'

export async function postPrintJobController(
  request: Request,
  response: AuthResponse,
  next: NextFunction,
): Promise<void> {
  const { userId } = response.locals.token
  const { label, copies } = request.body
  try {
    const job: WaitingPrintJob = {
      id: uuid(),
      label,
      copies,
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
