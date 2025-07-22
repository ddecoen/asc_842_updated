# Firebase Firestore Setup Instructions

This app now uses Firebase Firestore for persistent data storage. Follow these steps to set up your Firebase project:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "asc-842-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Register your app with a nickname (e.g., "ASC 842 Web App")
5. Copy the configuration object

## 4. Set Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase configuration values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 5. Deploy to Vercel

Add the same environment variables to your Vercel project:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each `NEXT_PUBLIC_FIREBASE_*` variable
5. Redeploy your app

## 6. Firestore Security Rules (Production)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to leases collection
    match /leases/{document} {
      allow read, write: if true; // Update this for authentication
    }
  }
}
```

## Cost Information

**Free Tier Limits (per day):**
- 50,000 document reads
- 20,000 document writes
- 1 GB storage

**Typical Usage for ASC 842 App:**
- Creating 10 leases: ~10 writes
- Viewing leases: ~10-50 reads
- **Expected cost: $0/month** (well within free tier)

## Troubleshooting

**Error: "Firebase config not found"**
- Check that all environment variables are set
- Restart your development server after adding `.env.local`

**Error: "Permission denied"**
- Check Firestore security rules
- Ensure you're in "test mode" for development

**Error: "Project not found"**
- Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is correct
- Check that Firestore is enabled in your Firebase project
