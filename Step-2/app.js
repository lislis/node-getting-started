const express = require('express')
const app = express()
const appBroker = require('./app_broker_client')

app.get('/', function (req, res) {
  res.send('Hello Node!')
})

app.get('/messages', async function (req, res) {
  try {
    const shards = await(appBroker.getShards())
    // Consume only first shard
    const iterator = await(appBroker.getIterator(shards[0].shardId))
    // Get messages
    const messages = await(appBroker.getMessages(iterator))
    res.send(JSON.stringify(messages))
  } catch(err) {
    res.send(`Error calling app-broker: ${err.message}`)
  }
})

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
