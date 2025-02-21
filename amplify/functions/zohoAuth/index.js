import { AuthenticationClient } from 'zoho-api-client'
import { SecretsManager } from '@aws-sdk/client-secrets-manager'

const ZOHO_CLIENT_ID = '1000.7OTNAMS0M49DAEYECKJOWQBH7G5KFE'
const ZOHO_CLIENT_SECRET = 'edd4e591d475d5ad105c0be1748e8e307c373b6d86'
const REDIRECT_URI = process.env.REDIRECT_URI // We'll set this in configuration

const secretsManager = new SecretsManager()

async function getRefreshToken() {
  const secret = await secretsManager.getSecretValue({
    SecretId: '/amplify/your-app-id/zoho/refresh-token'
  })
  return secret.SecretString
}

export async function handler (event) {
  try {
    const client = new AuthenticationClient({
      clientId: ZOHO_CLIENT_ID,
      clientSecret: ZOHO_CLIENT_SECRET,
      redirectUri: REDIRECT_URI
    })

    const refreshToken = await getRefreshToken()

    // Handle different auth operations based on the event type
    switch (event.operation) {
      case 'getAuthUrl':
        return {
          statusCode: 200,
          body: JSON.stringify({
            url: client.generateAuthUrl(['ZohoBooks.fullaccess.all', 'ZohoCRM.modules.all'])
          })
        }

      case 'getTokens':
        const { code } = event.arguments
        const tokens = await client.generateTokens(code)
        // Store refresh token securely
        return {
          statusCode: 200,
          body: JSON.stringify(tokens)
        }

      case 'refreshToken':
        const newTokens = await client.refreshAccessToken(refreshToken)
        return {
          statusCode: 200,
          body: JSON.stringify(newTokens)
        }

      default:
        throw new Error('Invalid operation')
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
} 