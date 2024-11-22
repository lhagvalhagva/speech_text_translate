import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDhLNT47nhx5Ipf65j8W0Zw6kV7UVFHj8Q",
  authDomain: "speech-99.firebaseapp.com",
  projectId: "speech-99",
  storageBucket: "speech-99.firebasestorage.app",
  messagingSenderId: "340637892691",
  appId: "1:340637892691:web:4627f19afbf97898a4c6a6",
  measurementId: "G-788BG412M2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
