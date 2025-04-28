import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBDpByLkWSigSZE-uueZUdr303ctc3ZXXA",
  authDomain: "saraha-c91ab.firebaseapp.com",
  projectId: "saraha-c91ab",
  storageBucket: "saraha-c91ab.firebasestorage.app",
  messagingSenderId: "844086620725",
  appId: "1:844086620725:web:fc893861ac2040a4fbb77c",
  measurementId: "G-PHM3PEY4BN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, provider, db,analytics  };
