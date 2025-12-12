const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

const urlParams = new URLSearchParams(window.location.search);
const agentId = urlParams.get("agent") || "riya";

document.getElementById("agentName").textContent = agentId.toUpperCase();

// Add message bubble
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message
async function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  msgInput.value = "";

  typing.style.display = "block";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId, message: text })
  });

  const data = await res.json();
  typing.style.display = "none";

  addMessage(data.reply, "bot");
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
