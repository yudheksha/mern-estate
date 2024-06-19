// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "avenue-mern-estate.firebaseapp.com",
  projectId: "avenue-mern-estate",
  storageBucket: "avenue-mern-estate.appspot.com",
  messagingSenderId: "247347175499",
  appId: "1:247347175499:web:85de679253cffb5c806dce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);