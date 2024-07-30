import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "XXXXXXXXXX",
    authDomain: "XXXXXXXXXX",
    databaseURL: "XXXXXXXXXXXXXXX",
    projectId: "XXXXX",
    storageBucket: "XXXXX",
    messagingSenderId: "XXXXX",
    appId: "XXXXX",
    measurementId: "XXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { db, auth };
