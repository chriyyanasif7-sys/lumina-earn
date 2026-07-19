import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ye aapki Firebase settings hain jo aapko Firebase Console se milti hain.
// Filhal hum ise placeholders ke sath save kar rahe hain.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "lumina-earn.firebaseapp.com",
  projectId: "lumina-earn",
  storageBucket: "lumina-earn.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services taake hum poore project me use kar sakein
export const auth = getAuth(app);
export const db = getFirestore(app);
