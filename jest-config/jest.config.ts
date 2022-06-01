import path from 'path'

const src = '<rootDir>/src'

export default {
  rootDir: path.join(__dirname, '..'),
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 70,
      function: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [`${src}/**/*.{ts,tsx}`],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', src],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  reporters: ['default'],
  setupFiles: [`${__dirname}/jest-setup.ts`],
  setupFilesAfterEnv: [`${__dirname}/jest-setup-after-env.ts`],
  testPathIgnorePatterns: ['/node_modules/', '.+support\\.test\\.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: ['((/__tests__/.*)|(\\.|/)(test|spec))\\.tsx?$'],
}
