<!-- docs/security/CREDENTIAL_ROTATION_GUIDE.md -->

# Credential Rotation Guide for 9takes

## Overview

This guide will walk you through rotating all credentials for the 9takes application. Follow each step carefully and update your `.env` file as you go.

For current evidence and priorities, see the [September 3, 2026 audit](./2026-09-03-security-audit.md). The database password needs rotation after exposure in an audit-tool error. The historical leaked service JWT was rejected with HTTP 401 during verification. Provider notes below are a historical inventory, not confirmation that every listed integration is active.

## 1. Supabase Credentials

### Steps:

1. Open the **9takes** project in the [Supabase Dashboard](https://supabase.com/dashboard/project/nhjjzcsnmyotyhykbajc).
2. For the exposed database password, use the database password settings. Inventory direct database clients, rotate the password, and update their connection settings through a secret manager or private environment file. Do not paste the password into chat, a command argument, a Git file, or a screenshot.
3. For API-key rotation, use Settings → API Keys. Prefer separately rotatable publishable and secret keys when compatible with every client. The application uses `PUBLIC_SUPABASE_PUBLISHABLE_KEY` and server-only `SUPABASE_SERVICE_KEY`.
4. Deploy and verify consumers of a replacement secret key before revoking the old one. A public/publishable key is intentionally included in browsers; database policies provide its access boundary.
5. Legacy `anon` and `service_role` JWT keys depend on the project's legacy JWT signing secret. Do not assume they can be regenerated independently. Follow the current [Supabase API-key rotation documentation](https://supabase.com/docs/guides/getting-started/api-keys) and account for session/client impact when rotating signing keys.
6. Update local and deployed environments consistently, then verify that the retired credential is rejected. The project URL does not change.

### Update in .env:

```
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=new_publishable_key_here
SUPABASE_SERVICE_KEY=new_service_key_here
```

## 2. OpenAI API Key

### Steps:

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name it "9takes-production"
4. Copy the key immediately (you won't see it again)
5. Delete the old key

### Update in .env:

```
OPENAI_API_KEY=sk-...your_new_key_here
```

## 3. Stripe Keys

### Steps:

1. Go to [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. For test mode: Use the test keys shown
3. For production: Click "Create secret key" under Standard keys
4. Copy both the publishable and secret keys

### Update in .env:

```
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_ENDPOINT_SECRET=whsec_...
```

## 4. AWS Credentials

### Steps:

1. Go to AWS IAM Console: [https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)
2. Go to Users → Select your user
3. Go to Security credentials tab
4. Create new access key
5. Download the CSV with credentials
6. Delete the old access key

### Update in .env:

```
AWS_ACCESS_KEY_ID=new_access_key_here
AWS_SECRET_ACCESS_KEY=new_secret_key_here
AWS_REGION=us-east-1
```

## 5. Elasticsearch Credentials

### Steps:

1. Log into your Elasticsearch Cloud console
2. Go to Security → API keys
3. Create a new API key with appropriate permissions
4. Copy the API key

### Update in .env:

```
ELASTIC_NODE=https://your-deployment.es.io:9243
ELASTIC_API_KEY=new_api_key_here
ELASTIC_CLOUD_ID=your_cloud_id
```

## 6. Gmail OAuth Credentials

### Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services → Credentials
4. Find your OAuth 2.0 Client ID
5. Download new credentials JSON
6. For the private key, you may need to create a new service account

### Update in .env:

```
GOOGLE_EMAIL=your-email@gmail.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

## 7. Other Keys to Rotate

### Anthropic API Key (if used):

```
ANTHROPIC_API_KEY=new_key_here
```

### PostHog (if used):

```
PUBLIC_POSTHOG_API_KEY=new_key_here
```

## After Rotation Checklist

- [ ] All old credentials have been revoked/deleted
- [ ] New credentials are saved in `.env` file
- [ ] `.env` file is in `.gitignore`
- [ ] Test the application locally with new credentials
- [ ] Update production environment variables
- [ ] Remove any hardcoded credentials from source code
- [ ] Create `.env.example` with dummy values for other developers

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all secrets
3. **Rotate credentials regularly** (every 90 days)
4. **Use least privilege** - only grant necessary permissions
5. **Monitor for exposed credentials** using tools like GitHub secret scanning
6. **Use different credentials** for development and production
