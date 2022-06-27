import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'

export type TokenPayload = {
  userId: string
  isAdmin?: boolean
}

export interface AuthResponse extends Response {
  locals: Record<string, unknown> & {
    token: TokenPayload
  }
}

export async function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const encodedToken = request.headers.authorization?.replace('Bearer ', '') || ''
    if (!encodedToken) {
      response.status(401).end()
      return
    }

    const decodedToken = jwt.decode(encodedToken, { complete: true })
    if (!decodedToken) {
      response.status(403).end()
      return
    }

    if (config.authentication.enabled) {
      try {
        // TODO: Get public key and verify token
        // jwt.verify(encodedToken, publicKey, { algorithms: ['RS256'] })
        request.log.warn('Verification of JWT token is not implemented!')
      } catch {
        response.status(403).end()
        return
      }
    }

    // TODO: validate token payload
    // Make decoded JWT payload accessible to controllers
    response.locals.token = decodedToken.payload
    next()
  } catch (error) {
    next(error)
  }
}
