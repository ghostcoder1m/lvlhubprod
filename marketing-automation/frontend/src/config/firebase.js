import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBfduMuZYinYKipD9lx6AnydPKtKgdzBwg",
  authDomain: "lvlhubfinal.firebaseapp.com",
  databaseURL: "https://lvlhubfinal-default-rtdb.firebaseio.com",
  projectId: "lvlhubfinal",
  storageBucket: "lvlhubfinal.firebasestorage.app",
  messagingSenderId: "553876578787",
  appId: "1:553876578787:web:a23440196434ea78b940d6",
  measurementId: "G-5CBG4WV3S0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app; 