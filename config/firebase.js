// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAcmPUClQndbq641uMmKWerkVC6kKkafWI",
    authDomain: "instaclone-e55be.firebaseapp.com",
    projectId: "instaclone-e55be",
    storageBucket: "instaclone-e55be.appspot.com",
    messagingSenderId: "440847774521",
    appId: "1:440847774521:web:aa24fc4a3cd5a5f48feee8",
    measurementId: "G-Y92HB8BNMH"
};

// Initialize Firebase
// getting single instance of auth
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }