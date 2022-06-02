import { Config, Environment, getConfig, ProcessVariables } from './config'

const mkConfigFactory =
  (environment: Environment) =>
  (configs: Omit<ProcessVariables, 'ENV'> = {}): ProcessVariables => ({
    ...configs,
    ENV: environment,
  })

const devConfig: Config = {
  environment: 'dev',
  logLevel: 'debug',
  authentication: {
    enabled: false,
  },
}

describe('getConfig', () => {
  it('should return dev config by default', () => expect(getConfig({})).toEqual(devConfig))

  describe('dev', () => {
    const mkConfig = mkConfigFactory('dev')

    it('should return dev config', () => {
      expect(getConfig(mkConfig())).toEqual(devConfig)
    })

    it('should set log level', () => {
      expect(getConfig(mkConfig({ LOG_LEVEL: 'fatal' }))).toMatchObject({
        logLevel: 'fatal',
      })
    })
  })

  describe('prod', () => {
    const mkConfig = mkConfigFactory('production')

    it('should return prod config', () => {
      expect(getConfig(mkConfig())).toEqual({
        environment: 'production',
        logLevel: 'info',
        authentication: {
          enabled: true,
        },
      })
    })

    it('should set log level', () => {
      expect(getConfig(mkConfig({ LOG_LEVEL: 'fatal' }))).toMatchObject({
        logLevel: 'fatal',
      })
    })
  })
})
