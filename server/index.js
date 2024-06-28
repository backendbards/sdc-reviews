import 'dotenv/config'
import express from 'express'
import router from './routes.js'
import path from 'path'
const __dirname = import.meta.url.split('/').slice(2,-1).join('/')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../../sdc-frontend/dist')));
app.use(express.json())

app.use('/', router)

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})