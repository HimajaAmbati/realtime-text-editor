const socket = io();
const editorElement = document.getElementById("editor");
const roomIdInput = document.getElementById("roomId");

let editor = CodeMirror.fromTextArea(editorElement, {
    mode: "javascript",
    lineNumbers: true,
    theme: "default"
});

// Generate or join room
const params = new URLSearchParams(window.location.search);
let roomId = params.get("room");

if (!roomId) {
    fetch("/new-room")
        .then(res => res.json())
        .then(data => {
            roomId = data.roomId;
            roomIdInput.value = `${window.location.origin}?room=${roomId}`;
        });
} else {
    roomIdInput.value = `${window.location.origin}?room=${roomId}`;
}

socket.emit("join-room", roomId);

// Detect changes and send updates
editor.on("change", () => {
    const content = editor.getValue();
    socket.emit("text-update", content);
});

// Receive updates and apply to editor
socket.on("text-update", (data) => {
    editor.setValue(data);
});

// Copy Room ID
function copyRoomId() {
    roomIdInput.select();
    document.execCommand("copy");
    alert("Room link copied!");
}



