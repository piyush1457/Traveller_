// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKtlgHEO9-M7SNrNKQ71PZ3k_54ZLftCg",
  authDomain: "travel-app-b789d.firebaseapp.com",
  projectId: "travel-app-b789d",
  storageBucket: "travel-app-b789d.firebasestorage.app",
  messagingSenderId: "914683989396",
  appId: "1:914683989396:web:758f197f43990336de5381",
  measurementId: "G-75VRGLJ1SG"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
