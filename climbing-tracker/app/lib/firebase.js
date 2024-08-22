// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAauSzeqxFiPVhrwQ8FxJsLX2uEyDrdfYE",
  authDomain: "climbing-web-app.firebaseapp.com",
  projectId: "climbing-web-app",
  storageBucket: "climbing-web-app.appspot.com",
  messagingSenderId: "767377200326",
  appId: "1:767377200326:web:3fce9eb4916f028f38f3c7",
  measurementId: "G-62ND4TW0GP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);