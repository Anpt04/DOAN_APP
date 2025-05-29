import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAFa_6IMGOUru3S6Rnm4fdvkK3_01OBFmA",
  authDomain: "appthuchi-170f7.firebaseapp.com",
  projectId: "appthuchi-170f7",
  storageBucket: "appthuchi-170f7.appspot.com",
  messagingSenderId: "570137495027",
  appId: "1:570137495027:web:6cf75aec4c7d8da25abe86",
  measurementId: "G-X350TKGZVQ"
};

// ✅ KHỞI TẠO ĐÚNG CÁCH:
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default firebaseConfig;
