import { NextFunction, Request, Response } from 'express'
import { db } from '../../db'

export async function healthController(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const dbState = await db
      .from('sqlite_master')
      .select()
      .then(() => 'up')
      .catch(() => 'down')

    response.json({
      apiServer: 'up',
      db: dbState,
    })
  } catch (error) {
    next(error)
  }
}
