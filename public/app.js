const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

const params = new URLSearchParams(window.location.search);
const agentId = params.get("agent") || "riya";

document.getElementById("agentName").innerText = agentId.toUpperCase();

// ================= STORAGE KEY =================
const STORAGE_KEY = "chat_" + agentId;

// ================= SHOW LOADING =================
typing.innerText = "Loading chat...";
typing.style.display = "block";

// ================= LOAD SAVED MESSAGES =================
setTimeout(() => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  chatBox.innerHTML = ""; // clear chat box first

  saved.forEach(m => {
    const div = document.createElement("div");
    div.className = "msg " + m.type;
    div.innerText = m.text;
    chatBox.appendChild(div);
  });

  typing.style.display = "none";
  chatBox.scrollTop = chatBox.scrollHeight;
}, 300); // small delay for smooth load

// ================= SAVE MESSAGE =================
function saveMessage(text, type) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.push({ text, type });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ================= ADD MESSAGE =================
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ================= SEND MESSAGE =================
async function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  saveMessage(text, "user");
  msgInput.value = "";

  typing.innerText = "Typing...";
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

// ================= EVENTS =================
sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});  if (!text) return;

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
