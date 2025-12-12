const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

// --- Get Agent from URL ---
const urlParams = new URLSearchParams(window.location.search);
const agent = urlParams.get("agent") || "riya";
document.getElementById("agentName").textContent = agent.toUpperCase();

// --- Send Message ---
async function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  msgInput.value = "";

  typing.style.display = "block";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId: agent, message: text })
  });

  const data = await res.json();
  typing.style.display = "none";

  addMessage(data.reply, "bot");
}

// --- Add Message to UI ---
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
