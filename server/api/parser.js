// Packages
import contentType from 'content-type'
import getRawBody from 'raw-body'

// Maps requests to buffered raw bodies so that
// multiple calls to `json` work as expected
const rawBodyMap = new WeakMap()

const parseJSON = str => {
  try {
    return JSON.parse(str)
  } catch (err) {
    throw new Error('Invalid JSON')
  }
}

export const getBuffer = (req, { limit = '1mb', encoding } = {}) =>
  Promise.resolve().then(() => {
    const type = req.headers['content-type'] || 'text/plain'
    const length = req.headers['content-length']

    // eslint-disable-next-line no-undefined
    if (encoding === undefined) {
      encoding = contentType.parse(type).parameters.charset
    }

    const body = rawBodyMap.get(req)

    if (body) {
      return body
    }

    return getRawBody(req, { limit, length, encoding })
      .then(buf => {
        rawBodyMap.set(req, buf)
        return buf
      })
      .catch(e => {
        throw new Error(e)
      })
  })

export const getText = (req, { limit, encoding } = {}) =>
  getBuffer(req, { limit, encoding }).then(body => body.toString(encoding))

export const getJson = (req, opts) =>
  getText(req, opts).then(body => parseJSON(body))
