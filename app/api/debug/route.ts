import { NextResponse } from 'next/server';

// Debug endpoint to check Firebase configuration
export async function GET() {
  try {
    // Check if environment variables are loaded
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
    };

    // Try to import Firebase (this will fail if config is wrong)
    let firebaseStatus = 'Not tested';
    try {
      const { db } = await import('@/lib/firebase');
      firebaseStatus = db ? '✓ Firebase initialized' : '✗ Firebase failed to initialize';
    } catch (error) {
      firebaseStatus = `✗ Firebase error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    return NextResponse.json({
      status: 'Debug info',
      environment: process.env.NODE_ENV,
      config,
      firebase: firebaseStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
