import { Request, Response } from 'express'

export function sendErrorResponse(
  error: Error & { status?: number; errors?: unknown[] },
  _request: Request,
  response: Response,
): void {
  const status = error.status ?? 500
  response.status(status).json({
    code: status,
    message: error.message,
    ...(status === 400 ? { errors: error.errors } : {}),
  })
}
