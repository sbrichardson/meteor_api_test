import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import parse from 'urlencoded-body-parser'

WebApp.connectHandlers.use('/hello', async (req, res, next) => {
  const { headers } = req

  console.info('/hello route - headers\n', headers)

  const result = await parse(req).catch(e => {
    console.error('/hello - err catch parsing urlencoded:\n', e)
  })

  console.info('\n\n** parse() urlencoded result:\n', result)

  const msg = result && result.content ? result.content : '(No content)'

  res.writeHead(200)
  res.end(
    `<html>
      <h1>Hello world from: ${Meteor.release}</h1>
      <h4>Provided Input: "${msg}"</h4>
    </html>`
  )
})

/**
 * Additional example using getJson
 *
 * @example
 * // Example using getJson from zeit/micro (renamed from json() there)
 *
 * import { getJson } from './parser'
 *
 * const json = await getJson(req).catch(e => {
 *   console.error('/hello - err catch parsing JSON:\n', e)
 * })
 *
 * console.info('\n\n** getJson parse result:\n', json)
 *
 */
