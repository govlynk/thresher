import { type ClientSchema, a } from '@aws-amplify/data-schema'
import { defineData } from '@aws-amplify/backend'

const schema = a.schema({
  ZohoAuth: a.model({
    id: a.id(),
    accessToken: a.string(),
    refreshToken: a.string(),
    expiresAt: a.datetime(),
    scope: a.list(a.string())
  }),
  Query: a.query({
    getZohoAuthUrl: a.func('zohoAuth').returns(a.string()),
    getZohoTokens: a.func('zohoAuth')
      .args({ code: a.string() })
      .returns(a.ref('ZohoAuth')),
    refreshZohoTokens: a.func('zohoAuth').returns(a.ref('ZohoAuth'))
  })
})

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey'
  }
}) 