
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyBlUx3IeTJSdhkvg-n4Sd0otu0cfdGG6b0",
  authDomain: "clothing-shop-427915.firebaseapp.com",
  projectId: "clothing-shop-427915",
  storageBucket: "clothing-shop-427915.appspot.com",
  messagingSenderId: "1000426255601",
  appId: "1:1000426255601:web:62e572be331e94cf2d2550",
  measurementId: "G-RK0VF4WJF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage =  getStorage(app);
export {storage};