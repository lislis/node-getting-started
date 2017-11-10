# Explanation Step-1 to Step-2

We haven't done IoT. Step-1 only got us to deploy a simple web-app in some managed
infrastructure. It's not clear yet whether Geeny is an IoT platform since we haven't
interacted with IoT devices.

In order to consume IoT sensor data (element subscriptions in Geeny terms) we just
have to do some API calls.

## A Simple Wrapper for the Application Broker API.

The Application Broker is the part of the system that sends all the data your app
needs. It's the communication bridge between your formula and our platform.

## `app_broker_client.js`

```javascript
const axios = require('axios')
const sleep = require('sleep')
const base64 = require('base-64')

const appId = process.env["GEENY_APPLICATION_ID"]
const host = process.env["GEENY_APPLICATION_BROKER_URL"]
const authToken = process.env["GEENY_APPLICATION_AUTH_TOKEN"]
```

First import all the necessary dependencies. Load environment variables that we'll
need to contact the app-broker service.

```
const brokerConfig = {
  appId:         appId,
  // From: https://developers.geeny.io/explorer/message-types/75d93472-4b81-46f1-848c-bfa8bf6de881
  messageTypeId: "75d93472-4b81-46f1-848c-bfa8bf6de881",
  iteratorType:  'EARLIEST', // 'LATEST' is an option too
  maxBatchSize:  10
}
```

We need to decide what kind of sensor data we want to consume. Here we use our
data-explorer to find the simulator-data since we don't know what kind of IoT devices
you have access to. You can select the batch-size but also whether you want to
consume either the EARLIEST or LATEST messages.


```javascript
module.exports = {
  getShards: async function () {
    (...)
  },

  getIterator: async function (shardId) {
    (...)
  },

  getMessages: async function (iterator) {
    (...)
  }
}
```

This is the core of our App-Broker-Client. It wraps the REST API using async
calls. For more details you can refer to the AppBroker API documentation (link).

Having done this, we are ready to get some IoT sensor data and display it in our
app. Let's go back to `app.js` to use our newly created app-broker-client.

## `app.js`

```
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
```

In order to consume messages we use a nasty `global-variable` for simplicity's
sake.

If you deploy this formula, you will get "[your-url]/messages".

First time we access the data-stream we go to the beginning of it. Later
renderings of that page would continue consuming the next messages and showing
different data.

```
(Missing data of the succesful run of the example)
```
