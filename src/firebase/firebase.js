import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyD8kn7vuT9GsDbYAJRImizG4JyxqKc-0Jg",
    authDomain: "smartslice-station.firebaseapp.com",
    projectId: "smartslice-station",
    storageBucket: "smartslice-station.appspot.com",
    messagingSenderId: "54077886075",
    appId: "1:54077886075:web:eddeb4f172990312341cde",
    measurementId: "G-QHMPKQFJJN"
  };

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  
  export { auth, firestore };
  
