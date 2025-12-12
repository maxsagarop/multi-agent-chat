// Load selected agent
let agentId = localStorage.getItem("agentId") || "riya";

const chatBox = document.getElementById("chat-box");
const typing = document.getElementById("typingIndicator");
const sendBtn = document.getElementById("send-btn");
const msgInput = document.getElementById("msg");

// Add message to chat
function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = "message " + type;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to backend server (REAL AI REPLY)
async function sendToAI(message) {
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                agentId: agentId,
                message: message
            })
        });

        const data = await res.json();
        return data.reply;

    } catch (err) {
        return "Server error, try again.";
    }
}

// On Send Button Click
sendBtn.onclick = async () => {
    const text = msgInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    msgInput.value = "";

    typing.style.display = "flex"; // show typing animation

    const reply = await sendToAI(text);

    typing.style.display = "none";

    addMessage(reply, "bot");
};

// Enter key support
msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
});
