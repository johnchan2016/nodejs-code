
const express = require('express')
const app = express()
const port = 3000

const APP_ENV = process.env.APP_ENV || 'local';

app.get('/', (req, res) => {
  res.send(`Hello World! This is ${APP_ENV}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

