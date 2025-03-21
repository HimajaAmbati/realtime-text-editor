import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCcKkQrOibwhlIuKjC6nZLCs_tqkU3EFLk",
    authDomain: "real-time-text-editor-dcc8c.firebaseapp.com",
    projectId: "real-time-text-editor-dcc8c",
    storageBucket: "real-time-text-editor-dcc8c.appspot.com",
    messagingSenderId: "293074666330",
    appId: "1:293074666330:web:d98e69abefd241b9ace963",
    measurementId: "G-S1N6MGQHV6"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export {doc,setDoc,getDoc,onSnapshot}
export { auth };
export function signIn() {
    signInWithPopup(auth, provider)
        .then((result) => {
            localStorage.setItem("user", JSON.stringify(result.user));
            window.location.reload();
        })
        .catch((error) => console.error("Login Error:", error));
}

export function logout() {
    signOut(auth).then(() => {
        localStorage.removeItem("user");
        window.location.reload();
    });
}

export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}


  
  
