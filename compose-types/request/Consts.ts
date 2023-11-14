/**
 * http mediaType
 */
export const MediaTypes = {
  urlEncode: 'application/x-www-form-urlencoded',
  json: 'application/json'
}

/**
 * http 返回头
 */
export const Headers = {
  contentType: 'Content-Type',
  contentLength: 'Content-Length',
  userAgent: 'User-Agent',
  xDeviceId: 'X-Device-Id',
  authorization: 'Authorization',
  xRefreshToken: 'X-Refresh'
}

/**
 * http Content-Type
 */
export const ContentTypes = {
  formType: {
    [Headers.contentType]: MediaTypes.urlEncode
  },
  jsonType: {
    [Headers.contentType]: MediaTypes.json
  }
}
