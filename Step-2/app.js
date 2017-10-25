const express = require('express')
const app = express()
const appBroker = require('./app_broker_client')

app.get('/', function (req, res) {
  res.send('Hello Node!')
})

app.get('/messages', function (req, res) {
  res.send('Messages Placeholder')
})

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
