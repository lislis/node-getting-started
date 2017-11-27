const axios = require('axios')
const sleep = require('sleep')
const base64 = require('base-64')

const appId = process.env["GEENY_APPLICATION_ID"]
const host = process.env["GEENY_APPLICATION_BROKER_SUBSCRIBER_URL"]
const token = process.env["GEENY_APPLICATION_AUTH_TOKEN"]

const brokerConfig = {
  appId:         appId,
  // From: https://developers.geeny.io/explorer/message-types/bce77a84-2382-4940-a0f8-7643be5c6a64
  messageTypeId: "bce77a84-2382-4940-a0f8-7643be5c6a64",
  iteratorType:  'EARLIEST',
  maxBatchSize:  10
}

function log(msg) {
  console.log(msg);
}

async function request(method, url, data) {
  try {
    const response = await axios.request({
      method: method,
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      },
      data: data
    })
    return response.data
  } catch (err) { throw err }
}

module.exports = {
  getShards: async function () {
    try {
      const url = `${host}/${brokerConfig.appId}/messageType/${brokerConfig.messageTypeId}`
      const response = await request('get', url)
      return response.shards
    } catch (err) { throw err }
  },

  getIterator: async function (shardId) {
    try {
      const data = {
        shardId: shardId,
        iteratorType: brokerConfig.iteratorType,
        maxBatchSize: brokerConfig.maxBatchSize
      }

      const iterator = await request('post', `${host}/${brokerConfig.appId}/messageType/${brokerConfig.messageTypeId}/iterator`, data)
      return iterator.shardIterator
    } catch (err) {
      log(`Error in getIterator, ERROR: ${err.message}`)
      throw err
    }
  },

  getMessages: async function (iterator) {
    try {
      const url = `${host}/${brokerConfig.appId}/messageType/${brokerConfig.messageTypeId}/iterator/${iterator}`
      const data = await request('get', url)

      if (data.messages.length > 0) {
	      let parsedMessages = data.messages.map(function (message) {
          return {
            userId: message.userId,
            thingId: message.thingId,
            data: base64.decode(message.payload)
          }
	      })
	      return { nextIterator: data.nextIterator, messages: parsedMessages }
      } else {
	      return data
      }
    } catch (err) {
      log(`Error in getIterator: ${err.message}`)
      throw err
    }
  }
}
