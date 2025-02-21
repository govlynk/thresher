import { generateClient } from 'aws-amplify/api'

const client = generateClient()

export async function initiateZohoAuth() {
  const { data } = await client.graphql({
    query: `
      query GetZohoAuthUrl {
        getZohoAuthUrl
      }
    `
  })
  window.location.href = data.getZohoAuthUrl
}

export async function handleZohoCallback(code) {
  const { data } = await client.graphql({
    query: `
      query GetZohoTokens($code: String!) {
        getZohoTokens(code: $code) {
          id
          accessToken
          refreshToken
          expiresAt
          scope
        }
      }
    `,
    variables: { code }
  })
  return data.getZohoTokens
}

export async function refreshTokens() {
  const { data } = await client.graphql({
    query: `
      query RefreshZohoTokens {
        refreshZohoTokens {
          id
          accessToken
          refreshToken
          expiresAt
          scope
        }
      }
    `
  })
  return data.refreshZohoTokens
} 