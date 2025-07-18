import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Simple Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Only initialize Firebase if we have valid config
function initializeFirebase() {
  if (app) return { app, auth: auth!, db: db! };
  
  // Check if we have the required config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase config missing, skipping initialization');
    return null;
  }
  
  try {
    // Initialize Firebase (avoid duplicate initialization)
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    
    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    
    return { app, auth, db };
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    return null;
  }
}

// Export functions that initialize on demand
export function getFirebaseAuth(): Auth {
  const firebase = initializeFirebase();
  if (!firebase) throw new Error('Firebase not initialized');
  return firebase.auth;
}

export function getFirebaseDb(): Firestore {
  const firebase = initializeFirebase();
  if (!firebase) throw new Error('Firebase not initialized');
  return firebase.db;
}

// For backward compatibility - these will be null during build
export { getFirebaseAuth as auth, getFirebaseDb as db };

// Export the app for other uses
export function getFirebaseApp(): FirebaseApp | null {
  const firebase = initializeFirebase();
  return firebase?.app || null;
}

export default getFirebaseApp;
