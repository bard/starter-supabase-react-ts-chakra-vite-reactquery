module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  transform: { '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'esbuild-jest' },
  moduleNameMapper: { '\\.(css|less|scss|sass)$': 'identity-obj-proxy' },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}
