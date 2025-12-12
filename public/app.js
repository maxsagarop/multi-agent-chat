let activeAgent = localStorage.getItem("agent") || "riya";

const chatBox = document.getElementById("chat-box");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function saveChat(text, type) {
  const key = "chat_" + activeAgent;
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  data.push({ text, type });
  localStorage.setItem(key, JSON.stringify(data));
}

function loadChat() {
  const key = "chat_" + activeAgent;
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  chatBox.innerHTML = "";
  data.forEach(m => addMessage(m.text, m.type));
}

loadChat();

async function sendToServer(text) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId: activeAgent, message: text })
  });

  return await res.json();
}

document.getElementById("send-btn").onclick = async () => {
  const msg = document.getElementById("msg");
  const text = msg.value.trim();
  if (!text) return;

  addMessage(text, "user");
  saveChat(text, "user");

  msg.value = "";

  const reply = await sendToServer(text);
  addMessage(reply.reply, "bot");
  saveChat(reply.reply, "bot");
};
