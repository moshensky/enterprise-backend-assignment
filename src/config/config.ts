import { Knex } from 'knex'
import path from 'path'
import { Level } from 'pino'

export type Environment = 'production' | 'dev'

export type Config = Readonly<{
  environment: Environment
  logLevel: Level
  authentication: {
    enabled: boolean
  }
  db: Knex.Sqlite3ConnectionConfig
}>

export type ProcessVariables = Partial<{
  ENV: Environment
  LOG_LEVEL: Level
}>

function getProductionConfig(processVariables: ProcessVariables): Config {
  return {
    environment: 'production',
    logLevel: processVariables.LOG_LEVEL ?? 'info',
    authentication: {
      enabled: true,
    },
    db: {
      filename: path.join(__dirname, '../../db.prod.db3'),
    },
  }
}

function getDevConfig(processVariables: ProcessVariables): Config {
  return {
    environment: 'dev',
    logLevel: processVariables.LOG_LEVEL ?? 'debug',
    authentication: {
      enabled: false,
    },
    db: {
      filename: path.join(__dirname, '../../db.dev.db3'),
    },
  }
}

export function getConfig(processVariables: ProcessVariables): Config {
  const environment: Environment = processVariables.ENV || 'dev'
  switch (environment) {
    case 'production':
      return getProductionConfig(processVariables)
    case 'dev':
      return getDevConfig(processVariables)
  }
}

export const config = getConfig(process.env as unknown as ProcessVariables)
