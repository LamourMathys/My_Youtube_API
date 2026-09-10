const express = require('express')
const app = express()

app.use(express.json())

const youtubersRoutes = require('./routes/youtubersRoutes')
app.use('/YTAPI', youtubersRoutes)


app.use(express.static('public'))
app.listen(3000, () => {
  console.log('localhost:3000')
})