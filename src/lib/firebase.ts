import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCzHpFkFs0JbHt71DdbZAlStljNdKpsUa0",
  authDomain: "sobserv-16418.firebaseapp.com",
  projectId: "sobserv-16418",
  storageBucket: "sobserv-16418.firebasestorage.app",
  messagingSenderId: "576085867283",
  appId: "1:576085867283:web:1d5171d098a2f7772078e6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'europe-west1');