import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD90aJGDZ8zOlMywFfqTvOE3PRrwAJBzU0",
  authDomain: "chat-app-d95ff.firebaseapp.com",
  projectId: "chat-app-d95ff",
  storageBucket: "chat-app-d95ff.appspot.com",
  messagingSenderId: "124854391108",
  appId: "1:124854391108:web:48204468c27bea396ec711",
  measurementId: "G-NZ77CW3XCQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, "localhost", 8080);
// }

export { auth, db };
