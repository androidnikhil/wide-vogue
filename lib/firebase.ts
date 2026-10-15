import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIsOiajJyb3JSDT0Axn5s1h5KcLYwYlPg",
  authDomain: "madhav-shringaar.firebaseapp.com",
  projectId: "madhav-shringaar",
  storageBucket: "madhav-shringaar.firebasestorage.app",
  messagingSenderId: "931635648603",
  appId: "1:931635648603:web:1f408a2f7c3b749de6877e",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
