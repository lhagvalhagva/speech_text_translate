import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhLNT47nhx5Ipf65j8W0Zw6kV7UVFHj8Q",
  authDomain: "speech-99.firebaseapp.com",
  projectId: "speech-99",
  storageBucket: "speech-99.firebasestorage.app",
  messagingSenderId: "340637892691",
  appId: "1:340637892691:web:4627f19afbf97898a4c6a6",
  measurementId: "G-788BG412M2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentSingleTabManager(),
  }),
});

// Enable offline persistence
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  if (err.code === "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.log("Persistence failed: Multiple tabs open");
  } else if (err.code === "unimplemented") {
    // The current browser doesn't support persistence
    console.log("Persistence not supported");
  }
}
