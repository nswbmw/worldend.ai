import neostandard from 'neostandard'

export default [
  ...neostandard({
    ignores: [
      'node_modules/**',
      '.wrangler/**',
      'dist/**',
      'drizzle/**',
      'test.js'
    ]
  }),
  {
    rules: {
      camelcase: 'off'
    }
  }
]
