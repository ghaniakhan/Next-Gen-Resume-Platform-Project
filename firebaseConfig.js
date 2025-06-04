import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsQOf35ltsYMJHCaw2b0y7ZjwHzESYvOg",
  authDomain: "resumeuploader-3319c.firebaseapp.com",
  projectId: "resumeuploader-3319c",
  storageBucket: "resumeuploader-3319c.appspot.com", // <-- correct bucket name
  messagingSenderId: "529412338581",
  appId: "1:529412338581:web:70d53b3d493f34218ffc9c",
  measurementId: "G-C2RX7SGLPV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

