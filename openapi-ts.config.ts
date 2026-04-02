import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:8080/api/docs-json',
  output: 'app/api',
  plugins: ['@hey-api/client-axios']
})
