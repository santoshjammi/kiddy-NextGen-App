// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZi7Q5hPeWKseu7N9Qt9uSVhzkfKTZg2s",
  authDomain: "kiddy-7badf.firebaseapp.com",
  projectId: "kiddy-7badf",
  storageBucket: "kiddy-7badf.firebasestorage.app",
  messagingSenderId: "315662288364",
  appId: "1:315662288364:web:848cf6fa8fa83244e7acc9",
  measurementId: "G-5SVSV64832"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);