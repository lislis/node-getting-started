# Explanation Step-1 to Step-2

We haven't done IoT. Step-1 only got us to deploy a simple web-app in some managed
infrastructure. It's not clear yet whether Geeny is an IoT platform since we haven't
interacted with IoT devices.

In order to consume IoT sensor data, two steps are necessary.

First: The end-user (i.e the owner of the device) should grant permission to the
formula to access the device data. This is commonly known as subscribing.

Second: Once the formula is subscribed to users' devices, you can call the
application broker to get your user's data.

For the time being, let's ignore the first step. Geeny automatically subscribes its
developers to their devices. This makes prototyping and playing around with data
easier and fun. We'll come back to authentication and authorization in the Step 3.

## A Simple Wrapper for the Application Broker API.

The Application Broker is the part of the system that sends all the data your app
needs. It's the communication bridge between your formula and our platform.

## `app_broker_client.js`

First import all the necessary dependencies. Load environment variables that we will
need to contact the app-broker service.

```javascript
const axios = require('axios')
const sleep = require('sleep')
const base64 = require('base-64')

const appId = process.env["GEENY_APPLICATION_ID"]
const host = process.env["GEENY_APPLICATION_BROKER_URL"]
const authToken = process.env["GEENY_APPLICATION_AUTH_TOKEN"]
```
Second, we need to configure it so it points to the right device. The data a device
sends uses an identifier that acts as the data schema. This is called the
messageTypeId. Each device's data has a messageTypeId. Right now we configured it to
use the Garmin Simulator device. This device replays garmin fitness wearable. You can
configure this messageTypeId to use any of the available devices, and for this
purpose we have a handy tool to explore Geeny's devices. Geeny's
[DataExplorer](https://developers.geeny.io/explorer) it's like the yellow-pages of
the available devices that are Geeny-compatible.

Additionally, you can select the batch-size but also whether you want to consume
either the EARLIEST or LATEST messages. There's no better way, it depends on your
formula's requirements.

```javascript
// Link in the DataExplorer: https://developers.geeny.io/explorer/message-types/75d93472-4b81-46f1-848c-bfa8bf6de881
const brokerConfig = {
  appId:         appId,
  messageTypeId: "75d93472-4b81-46f1-848c-bfa8bf6de881",
  iteratorType:  'EARLIEST', // 'LATEST' is an option too
  maxBatchSize:  10
}
```

## Creating a wrapper for the Application Broker ##

This is the core of our App-Broker-Client. It wraps the REST API using async
calls. There's a shards call to know in how many partitions your data is being
sent. An iterator that gives you a "pointer" or "checkpoint" to your data. And
finally, a getMessages that retrieves the messages from a given iterator and the ID
of the next iterator.

For more details you can refer to the [AppBroker API
documentation](https://docs.geeny.io/api/application-broker/).


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

## `app.js`

Now that we have all the tools, we are ready to wire it all up and make a formula
that demos data consumption.

This snippet does the following:

1. Initializes the iterator if needed
2. Gets the data of the iterator
3. Updates the iterator to the new position
4. Renders the data as json in the /messages endpoint of your formula.

```
var lastIterator = null
app.get('/messages', async function (req, res) {
  try {
    if(lastIterator == null) {
	  // Get the shard information about the given message type
      const shards = await(appBroker.getShards())
      // Consume only first shard
      lastIterator = await(appBroker.getIterator(shards[0].shardId))
    }

    // With the current iterator, get the messages and the next iterator.
    const messages = await(appBroker.getMessages(lastIterator))\
    lastIterator = messages.nextIterator
    res.send(JSON.stringify(messages))
  } catch(err) {
    res.send(`Error calling app-broker: ${err.message}`)
  }
})
```

Go ahead, deploy the formula and if you go to  "[your-formula-url]/messages" you
should see some garmin messages.

```
(Missing data of the succesful run of the example)
```
