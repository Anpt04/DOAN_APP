// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFa_6IMGOUru3S6Rnm4fdvkK3_01OBFmA",
  authDomain: "appthuchi-170f7.firebaseapp.com",
  projectId: "appthuchi-170f7",
  storageBucket: "appthuchi-170f7.firebasestorage.app",
  messagingSenderId: "570137495027",
  appId: "1:570137495027:web:6cf75aec4c7d8da25abe86",
  measurementId: "G-X350TKGZVQ"
};

// Initialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebaseConfig;
  