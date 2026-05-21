// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
// analytics is lazily initialized below
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZi7Q5hPeWKseu7N9Qt9uSVhzkfKTZg2s",
  authDomain: "kiddy-7badf.firebaseapp.com",
  projectId: "kiddy-7badf",
  storageBucket: "kiddy-7badf.firebasestorage.app",
  messagingSenderId: "315662288364",
  appId: "1:315662288364:web:7a82bb8362c6bf86e7acc9",
  measurementId: "G-V1NMF9Y5G9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only in the browser
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ isSupported }) =>
    isSupported().then((yes) => yes && getAnalytics(app))
  );
}

// Initialize Firestore with IndexedDB persistent cache.
// On revisits Firestore returns cached data instantly (<50 ms),
// then quietly syncs any updates from the server in the background.
export const db = typeof window !== 'undefined'
  ? initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    })
  : initializeFirestore(app, {});

// Initialize Auth
export const auth = getAuth(app);