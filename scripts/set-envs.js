const { writeFileSync, mkdirSync} = require('fs')

require('dotenv').config()

const targetPath = './src/environments/environment.ts'
const targetPathDev = './src/environments/environment.development.ts'

const mapKey = process.env['api_key']

if (!mapKey) {
  throw new Error('API key is not set in the environment variables.')
}

const envFileContent = `
  export const environment = {
  apiKey:
  "${ process.env[mapKey] }",
};

`
const envDevFileContent = `
  export const environment = {
  apiKey:"${ process.env[mapKey] }",
};

`

mkdirSync('./src/environments', { recursive: true })
writeFileSync(targetPath, envFileContent)
writeFileSync(targetPathDev, envDevFileContent)
