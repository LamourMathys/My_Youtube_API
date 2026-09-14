const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const app = express()

app.use(express.json())

const youtubersRoutes = require('./routes/youtubersRoutes')
app.use('/YTAPI', youtubersRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(express.static('public'))
app.listen(3000, () => {
  console.log('localhost:3000')
})