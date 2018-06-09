import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { getJson } from './parser'

WebApp.connectHandlers.use('/hello', async (req, res, next) => {
  console.info('/hello route hit, req\n', req)

  const json = await getJson(req).catch(e => {
    console.error('/hello - err catch parsing json', e)
  })

  json && console.info('getJson parse result:\n', json)

  res.writeHead(200)
  res.end(`Hello world from: ${Meteor.release}`)
})
