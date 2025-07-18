# ASC 842 Lease Accounting - Simplified

A clean, simple ASC 842 lease accounting application built with Next.js 14, Firebase, and TypeScript.

## Features

- ✅ ASC 842 compliant lease calculations
- ✅ Firebase Authentication (email/password)
- ✅ Firestore database for lease storage
- ✅ Automated journal entry generation
- ✅ Simple, responsive UI
- ✅ Easy Vercel deployment

## Quick Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase values:

```bash
cp .env.example .env.local
```

**Required variables:**
```
FIREBASE_API_KEY=AIzaSyDTlUJNYuBF7K_nIM8Zhg9XS4XZIIhqYwM
FIREBASE_AUTH_DOMAIN=asc-842-lease-accounting.firebaseapp.com
FIREBASE_PROJECT_ID=asc-842-lease-accounting
FIREBASE_STORAGE_BUCKET=asc-842-lease-accounting.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=143057481221
FIREBASE_APP_ID=1:143057481221:web:8056ee8085bb972b3eb66c
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key_with_newlines"
```

### 2. Install and Run

```bash
npm install
npm run dev
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables to Vercel
vercel env add FIREBASE_API_KEY
vercel env add FIREBASE_AUTH_DOMAIN
# ... add all variables

# Deploy to production
vercel --prod
```

## Firebase Setup

1. **Create Firebase Project**: [console.firebase.google.com](https://console.firebase.google.com)
2. **Enable Authentication**: Email/Password sign-in method
3. **Create Firestore Database**: Start in production mode
4. **Generate Service Account**: Project Settings → Service Accounts → Generate Key
5. **Get Web Config**: Project Settings → General → Web App

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leases/{leaseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## API Endpoints

- `GET /api/leases` - Get user's leases
- `POST /api/leases` - Create new lease
- `GET /api/journal-entries?leaseId=xxx` - Get journal entries for lease

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Firebase** for auth and database
- **TailwindCSS** for styling
- **Zod** for validation

## Deployment

This app is optimized for Vercel deployment with minimal configuration required.
