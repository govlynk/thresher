import { defineFunction } from '@aws-amplify/backend'

export const zohoAuth = defineFunction({
  name: 'zohoAuth',
  entry: './index.js',
  runtime: 'nodejs18.x',
  memory: 512,
  timeout: 30,
  environment: {
    REDIRECT_URI: 'https://your-app-domain/auth/zoho/callback'
  }
}) 