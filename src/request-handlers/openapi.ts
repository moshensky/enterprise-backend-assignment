import * as OpenApiValidator from 'express-openapi-validator'
import path from 'path'
// import { config } from '../config/config'

const apiSpec = path.join(__dirname, '../../docs/labeling-printer.0.0.oas.yaml')

export const validateViaOpenapi = OpenApiValidator.middleware({
  apiSpec,
  validateRequests: true, // (default)
  // TODO: figure out why openapi doesn't validate error responses correctly. It might not be able to dereference results
  validateResponses: false, //config.environment === 'dev',
})
