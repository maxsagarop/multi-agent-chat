let activeAgent = localStorage.getItem("agent") || "riya";

const chatBox = document.getElementById("chat-box");
const typing = document.getElementById("typingIndicator");

// Add message
function addMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add(type, "message");
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Save chat
function saveChat(text, type) {
  const key = "chat_" + activeAgent;
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  data.push({ text, type });
  localStorage.setItem(key, JSON.stringify(data));
}

// Load previous chat
(function loadChat() {
  const key = "chat_" + activeAgent;
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  data.forEach(m => addMessage(m.text, m.type));
})();

// Server request
async function sendToServer(text) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      agentId: activeAgent,
      message: text
    })
  });
  return await res.json();
}

// Send button
document.getElementById("send-btn").onclick = async () => {
  const msg = document.getElementById("msg");
  const text = msg.value.trim();
  if (!text) return;

  addMessage(text, "user");
  saveChat(text, "user");
  msg.value = "";

  // Show typing animation
  const agentNames = {
    riya:"রিয়া", meherin:"মেহরিন",
    disha:"দিশা", ayesha:"আয়েশা", ananya:"অনন্যা"
  };
  document.getElementById("typingName").innerText =
    agentNames[activeAgent] + " is typing";

  typing.style.display = "flex";

  await new Promise(r => setTimeout(r, 1500));

  const reply = await sendToServer(text);

  typing.style.display = "none";

  addMessage(reply.reply, "bot");
  saveChat(reply.reply, "bot");
};  return await res.json();
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
