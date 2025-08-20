import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "clash-hub-dube",
  "appId": "1:762507233458:web:442be21d4b1197930b61ab",
  "storageBucket": "clash-hub-dube.appspot.com",
  "apiKey": "AIzaSyCHYef-UM2RFvs_6xiIDfEZ-PqhOSEILbs",
  "authDomain": "clash-hub-dube.firebaseapp.com",
  "messagingSenderId": "762507233458"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
