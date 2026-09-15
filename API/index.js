const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const app = express()

app.use(express.json())

const loginRoutes = require('./routes/loginRoutes')
const youtubersRoutes = require('./routes/youtubersRoutes')

app.use('/login', loginRoutes)
app.use('/YTAPI', youtubersRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(express.static('public'))
app.listen(3000, '0.0.0.0', () => {
  console.log('localhost:3000')
})