import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const baseConfig: Record<string, string | undefined> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(baseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  const friendly = missingKeys.join(', ');
  throw new Error(`Missing Firebase environment values: ${friendly}`);
}

const firebaseConfig: FirebaseOptions = {
  apiKey: baseConfig.apiKey!,
  authDomain: baseConfig.authDomain!,
  projectId: baseConfig.projectId!,
  storageBucket: baseConfig.storageBucket!,
  messagingSenderId: baseConfig.messagingSenderId!,
  appId: baseConfig.appId!,
};

const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
if (measurementId) {
  firebaseConfig.measurementId = measurementId;
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
