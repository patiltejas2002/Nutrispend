// src/firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyCx2eRbYl3o_KKi-idtan9QI-yS1zTUKtQ",
  authDomain: "nutrispend.firebaseapp.com",
  projectId: "nutrispend",
storageBucket: "nutrispend.appspot.com",

  messagingSenderId: "66007135542",
  appId: "1:66007135542:web:cc58eeefb7e07b91f76f97",
  measurementId: "G-LKWVBPH72B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);