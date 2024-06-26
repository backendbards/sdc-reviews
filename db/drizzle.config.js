import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '../.env' })

console.log(process.env.DB_URL)

export default defineConfig({
  "schema": "./schema.js",
  "out": "./drizzle",
  "dialect": "postgresql",
  "dbCredentials": {
    "url": process.env.DB_URL
  }
})