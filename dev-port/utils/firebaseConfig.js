// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "portfolio-app-f876a.firebaseapp.com",
  projectId: "portfolio-app-f876a",
  storageBucket: "portfolio-app-f876a.appspot.com",
  messagingSenderId: "100495938593",
  appId: "1:100495938593:web:34680d45d97281450bbf60",
  measurementId: "G-0GS0JNLWKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);