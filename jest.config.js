module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  testMatch: ['**/tests/**/*.test.ts', '**/__tests__/**/*.test.ts', '**/src/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@so-ric/colorspace$': '<rootDir>/__mocks__/@so-ric/colorspace.js'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/**/index.ts',
    '!src/tests/**',
    '!src/migrations/**',
    '!src/common/config/di.ts',
    '!src/**/main.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: ['node_modules/(?!(@so-ric/colorspace|@dabh/diagnostics|color)/)']
};
