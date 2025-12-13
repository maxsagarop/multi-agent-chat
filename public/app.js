document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chat-box");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send-btn");
  const typing = document.getElementById("typing");

  if (!sendBtn || !msgInput) {
    alert("Send button or input not found");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const agentId = params.get("agent") || "riya";

  document.getElementById("agentName").innerText = agentId.toUpperCase();

  const STORAGE_KEY = "chat_" + agentId;

  // ===== Load old messages =====
  typing.innerText = "Loading chat...";
  typing.style.display = "block";

  setTimeout(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    chatBox.innerHTML = "";

    saved.forEach(m => {
      const div = document.createElement("div");
      div.className = "msg " + m.type;
      div.innerText = m.text;
      chatBox.appendChild(div);
    });

    typing.style.display = "none";
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 200);

  // ===== Save message =====
  function saveMessage(text, type) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    data.push({ text, type });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // ===== Add message =====
  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // ===== Send message =====
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

    } catch (e) {
      typing.style.display = "none";
      addMessage("Server error", "bot");
    }
  }

  // ===== EVENTS =====
  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

});
