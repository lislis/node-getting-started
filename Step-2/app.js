const express = require('express')
const app = express()
const appBroker = require('./app_broker_client')

app.get('/', function (req, res) {
  res.send('Hello Node!')
})

var lastIterator = null

app.get('/messages', async function (req, res) {
  try {
    if(lastIterator == null) {
      const shards = await(appBroker.getShards())
      // Consume only first shard
      lastIterator = await(appBroker.getIterator(shards[0].shardId))
    }

    // Get messages
    const messages = await(appBroker.getMessages(lastIterator))
    lastIterator = messages.nextIterator
    res.send(JSON.stringify(messages))
  } catch(err) {
    res.send(`Error calling app-broker: ${err.message}`)
  }
})

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
