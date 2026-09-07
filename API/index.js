const express = require('express')
const app = express()

app.use(express.json())

const youtubersRoutes = require('./routes/youtubersRoutes')
app.use('/youtubers', youtubersRoutes)

app.get('/', (req, res) => {
  res.send('go to /youtubers')
})

app.listen(3000, () => {
  console.log('localhost:3000')
})