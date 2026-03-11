// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCKiULwuu3ruQ46bWUmtuvPqbsq8zTkrKc",
  authDomain: "jobapp2026-bd8a9.firebaseapp.com",
  projectId: "jobapp2026-bd8a9",
  storageBucket: "jobapp2026-bd8a9.firebasestorage.app",
  messagingSenderId: "252531504557",
  appId: "1:252531504557:web:7e8ec6245cf2e9c2711d24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  db, 
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc
};
