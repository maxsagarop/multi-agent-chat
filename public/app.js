const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

const params = new URLSearchParams(window.location.search);
const agentId = params.get("agent") || "riya";

document.getElementById("agentName").innerText = agentId.toUpperCase();

// 🔹 LocalStorage key (agent-wise)
const STORAGE_KEY = "chat_" + agentId;

// 🔹 Load old messages when page loads
const oldMessages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
oldMessages.forEach(m => addMessage(m.text, m.type));

// 🔹 Save message
function saveMessage(text, type) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.push({ text, type });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 🔹 Add message to UI
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔹 Send message
async function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  saveMessage(text, "user");
  msgInput.value = "";

  typing.style.display = "block";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, message: text })
    });

    const data = await res.json();
    typing.style.display = "none";

    addMessage(data.reply, "bot");
    saveMessage(data.reply, "bot");

  } catch {
    typing.style.display = "none";
    addMessage("Server error, try again.", "bot");
  }
}

// 🔹 Events
sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
