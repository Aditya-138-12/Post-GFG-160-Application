// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBndS3ZAloDRXhkIKsMLcLF9sWP2rqe31g",
    authDomain: "post-gfg-160.firebaseapp.com",
    projectId: "post-gfg-160",
    storageBucket: "post-gfg-160.firebasestorage.app",
    messagingSenderId: "921779254991",
    appId: "1:921779254991:web:ed8cb9d4274545738f29ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);