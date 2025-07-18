import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

function initializeFirebaseAdmin() {
  if (app) return { app, adminDb: adminDb!, adminAuth: adminAuth! };
  
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    app = getApps()[0];
  }
  
  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
  
  return { app, adminDb, adminAuth };
}

// Export functions that initialize on demand
export function getAdminDb(): Firestore {
  const { adminDb } = initializeFirebaseAdmin();
  return adminDb;
}

export function getAdminAuth(): Auth {
  const { adminAuth } = initializeFirebaseAdmin();
  return adminAuth;
}

// For backward compatibility
export { getAdminDb as adminDb, getAdminAuth as adminAuth };
