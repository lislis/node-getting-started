const axios = require('axios')
const sleep = require('sleep')
const base64 = require('base-64')

const appId = process.env["GEENY_APPLICATION_ID"]
const host = process.env["GEENY_APPLICATION_BROKER_URL"]

const brokerConfig = {
  appId: appId,
  messageTypeId: '54121087-14f1-4c2a-835f-117681618cc9', // incoming Develco messageType
  iteratorType: 'LATEST',
  maxBatchSize: 10
}

module.exports = {
  request: async function (method, url, data) {
    try {
      const response = await axios.request({
	method: method,
	url: url,
	headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
	},
	data: data
      })
      return response.data
    } catch (err) { throw err }
  },

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

  getMessages: async function  (iterator, processData) {
    try {
      const url = `${host}/${brokerConfig.appId}/messageType/${brokerConfig.messageTypeId}/iterator/${iterator}`
      const data = await request('get', url)

      if (data.messages.length > 0) {
	for (let message of data.messages) {
	  let parsedData = {
	    userId: message.userId,
	    thingId: message.thingId,
	    data: base64.decode(message.payload)
	  }

	  processData(parsedData)
	}
	sleep.msleep(250)
      } else {
	sleep.sleep(1)
      }
      getMessages(data.nextIterator, processData)
    } catch (err) {
      log(`Error in getIterator: ${err.message}`)
      throw err
    }
  }
}
