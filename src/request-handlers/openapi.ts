import * as OpenApiValidator from 'express-openapi-validator'
import path from 'path'
import { config } from '../config/config'

const apiSpec = path.join(__dirname, '../../docs/labeling-printer.0.0.oas.yaml')

export const validateViaOpenapi = OpenApiValidator.middleware({
  apiSpec,
  validateRequests: true, // (default)
  validateResponses: config.environment === 'dev',
})
