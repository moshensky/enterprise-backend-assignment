import { Level } from 'pino'

export type Environment = 'production' | 'dev'

export type Config = Readonly<{
  environment: Environment
  logLevel: Level
  authentication: {
    enabled: boolean
  }
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
  }
}

function getDevConfig(processVariables: ProcessVariables): Config {
  return {
    environment: 'dev',
    logLevel: processVariables.LOG_LEVEL ?? 'debug',
    authentication: {
      enabled: false,
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
