import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDlc1E686GY3Y6aQUz2z1yA6T0_qLr1ek",
  authDomain: "next-storage-d79e4.firebaseapp.com",
  projectId: "next-storage-d79e4",
  storageBucket: "next-storage-d79e4.appspot.com",
  messagingSenderId: "945175724503",
  appId: "1:945175724503:web:c6cf5085ac69e24ce9cb92",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

