// Copy your Firebase config values here or set them via environment variables.
// Rename .env.example to .env and fill in the values to enable Firebase.

function requireEnv(name) {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(
      `Firebase config missing: ${name}. Create a .env file (from .env.example) and set ${name}`,
    )
  }
  return value
}

const firebaseConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
}

// Log config in dev to ensure vars are loaded (no secrets are printed in prod).
if (import.meta.env.MODE !== 'production') {
  console.log('[Firebase] config loaded', {
    apiKey: firebaseConfig.apiKey ? 'OK' : 'MISSING',
    authDomain: firebaseConfig.authDomain ? 'OK' : 'MISSING',
    projectId: firebaseConfig.projectId ? 'OK' : 'MISSING',
    storageBucket: firebaseConfig.storageBucket ? 'OK' : 'MISSING',
    messagingSenderId: firebaseConfig.messagingSenderId ? 'OK' : 'MISSING',
    appId: firebaseConfig.appId ? 'OK' : 'MISSING',
  })
}

export default firebaseConfig
