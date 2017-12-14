const express = require('express')
const app = express()
const appBroker = require('./app_broker_client')

app.get('/', function (req, res) {
  res.send('Hello Node!')
})

const parameters = {
  messageTypeId: "bce77a84-2382-4940-a0f8-7643be5c6a64",
  iteratorType:  'EARLIEST',
  maxBatchSize:  10
}

var lastIterator = null

app.get('/messages', handleMessages)

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})

async function handleMessages (req, res) {
  try {
    const messages = await(getMessages(req))
    res.send(JSON.stringify(messages))
  } catch(err) {
    // Iterator expired - request another one and try again
    if(err.response && err.response.status == 404) {
      lastIterator = null
      handleMessages(req, res)
    } else {
        res.send(`Error calling app-broker: ${err.message}`)
    }
  }
}

async function getMessages(req) {
  if(lastIterator == null) {
    const shards = await(appBroker.getShards(parameters))
    // Consume only first shard
    lastIterator = await(appBroker.getIterator(parameters, shards[0].shardId))
  }

  // Get messages
  const messages = await(appBroker.getMessages(parameters, lastIterator))
  lastIterator = messages.nextIterator
  return messages
}