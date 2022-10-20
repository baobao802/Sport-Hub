// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAnnqul1lLXgr0KusrQpD6iOfRurUHjmy8',
  authDomain: 'sporthub-802.firebaseapp.com',
  projectId: 'sporthub-802',
  storageBucket: 'sporthub-802.appspot.com',
  messagingSenderId: '762414949590',
  appId: '1:762414949590:web:d059b6a658bf819b931577',
  databaseURL:
    'https://sporthub-802-default-rtdb.asia-southeast1.firebasedatabase.app',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
