import { db,doc, setDoc, getDoc, onSnapshot  } from "./firebase.js";

// Select elements
const editor = document.getElementById("editor");
const saveButton = document.getElementById("saveButton"); // Save button
const roomIdInput = document.getElementById("roomId");

// Generate or retrieve a unique room ID
let urlParams = new URLSearchParams(window.location.search);
let roomId = urlParams.get("room") || localStorage.getItem("roomId") || Math.random().toString(36).substr(2, 9);
roomIdInput.value = `${window.location.origin}/?room=${roomId}`;
localStorage.setItem("roomId", roomId);

// Firestore document reference
const docRef = doc(db, "documents", roomId);

// Track local changes to prevent overwriting
let isLocalChange = false;
let lastContent = ""; // Store last known Firestore content

// Load document content from Firestore when the page loads
async function loadDocument() {
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            lastContent = docSnap.data().content || "";
            editor.value = lastContent;
        } else {
            // Create document if it doesn’t exist
            await setDoc(docRef, { content: "" });
        }
    } catch (error) {
        console.error("Error loading document:", error);
    }
}
loadDocument(); // Call function on page load

// Real-time collaboration: Listen for updates (Updated sync)
onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
        const newText = docSnap.data().content || "";

        // Prevent overwriting local typing
        if (!isLocalChange && newText !== lastContent) {
            const cursorPosition = editor.selectionStart; // Save cursor position
            editor.value = newText; // Update text from Firestore
            editor.setSelectionRange(cursorPosition, cursorPosition); // Restore cursor position
            lastContent = newText; // Update last known content from Firestore
        }
        isLocalChange = false; // Reset flag
    }
});

// Save document manually on button click (syncs with Firestore)
saveButton.addEventListener("click", async () => {
    try {
        isLocalChange = true; // Mark as local change
        lastContent = editor.value; // Update last known content
        await setDoc(docRef, { content: editor.value }, { merge: true });
        console.log("Document saved manually!");
        alert("Changes saved!");
    } catch (error) {
        console.error("Error saving document:", error);
    }
});

// Auto-save after user stops typing (Debounce mechanism)
let typingTimer;
editor.addEventListener("input", () => {
    isLocalChange = true; // Mark as local update

    clearTimeout(typingTimer);
    typingTimer = setTimeout(async () => {
        try {
            lastContent = editor.value; // Update last known content
            await setDoc(docRef, { content: editor.value }, { merge: true });
            console.log("Auto-saved document!");
        } catch (error) {
            console.error("Error auto-saving document:", error);
        }
    }, 1000); // Auto-save after 1 second of inactivity
});











