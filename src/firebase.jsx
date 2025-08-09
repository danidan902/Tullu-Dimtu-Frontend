// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKccRqSmwDSQZNLOQUFlPJ3_uFc-LCix0",
  authDomain: "tullu-dimtu.firebaseapp.com",
  projectId: "tullu-dimtu",
  storageBucket: "tullu-dimtu.firebasestorage.app",
  messagingSenderId: "978752176638",
  appId: "1:978752176638:web:c108260242deb97bf740af",
  measurementId: "G-7SYZN8XWSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);