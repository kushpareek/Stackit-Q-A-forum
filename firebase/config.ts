
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// User's provided Firebase project configuration
const firebaseConfig = {
  apiKey: "Your_Key",
  authDomain: "your_domain",
  projectId: "Your_project_ID",
  storageBucket: "Your_bucket",
  messagingSenderId: "Your_messenging ID",
  appId: "Your_app_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);