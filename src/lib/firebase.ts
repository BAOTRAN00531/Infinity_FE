// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA3e7AY6CjbDu4qd0OZDJ6enfyi81IOh7I",
    authDomain: "infinity-1d675.firebaseapp.com",
    projectId: "infinity-1d675",
    storageBucket: "infinity-1d675.appspot.com",
    messagingSenderId: "1018947496074",
    appId: "1:1018947496074:web:f6dbdba59f196e4e05e573",
    measurementId: "G-R2LP8N3QRS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
