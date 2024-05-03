document.addEventListener("DOMContentLoaded", function() {
    const messagesDiv = document.getElementById('messages');
    const nameInput = document.getElementById('name-input');
    const messageInput = document.getElementById('message-input');
    const fileInput = document.getElementById('file-input');
    const sendBtn = document.getElementById('send-btn');

    // Function to send message
    function sendMessage() {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        const file = fileInput.files[0];

        if (name === '' || (message === '' && !file)) {
            alert('Please enter your name and message, or select a file.');
            return;
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'message';

        messageElement.innerHTML = `
            <span class="name">${name} >>> ${message}
        `;

        if (file) {
            const fileType = file.type;
            const reader = new FileReader();
            reader.onload = function(e) {
                let mediaElement;
                if (fileType.startsWith('image')) {
                    mediaElement = `<img src="${e.target.result}" class="attachment">`;
                } else if (fileType.startsWith('video')) {
                    mediaElement = `<video controls class="attachment"><source src="${e.target.result}" type="${fileType}">Your browser does not support the video tag.</video>`;
                }
                messageElement.innerHTML += mediaElement;
            }
            reader.readAsDataURL(file);
        }

        messagesDiv.appendChild(messageElement);

        // Clear message and file input fields
        messageInput.value = '';
        fileInput.value = '';

        // Auto scroll to bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Send message through WebSocket
        const socket = new WebSocket("ws://localhost:8765");  // Change the WebSocket URL as needed
        socket.send(name + "> " + message);
    }

    // Event listener for Enter key
    messageInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Event listener for Send button click
    sendBtn.addEventListener('click', function() {
        sendMessage();
    });

    // WebSocket message listener
    const socket = new WebSocket("ws://localhost:8765");  // Change the WebSocket URL as needed
    socket.addEventListener("message", function(event) {
        const messageDiv = document.createElement("div");
        messageDiv.className = 'message received';
        messageDiv.textContent = event.data;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
});
