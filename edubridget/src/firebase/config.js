import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdROSsizgV9NenSRFtu2iQygONPAiUqBw",
  authDomain: "edubridge-5da54.firebaseapp.com",
  projectId: "edubridge-5da54",
  storageBucket: "edubridge-5da54.firebasestorage.app",
  messagingSenderId: "588882204903",
  appId: "1:588882204903:web:704b4d994f8b88aebe6a42",
  measurementId: "G-WCQ09PQS3Y"
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app)

export { app, db }