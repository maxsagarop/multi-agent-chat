document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chat-box");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send-btn");
  const typing = document.getElementById("typing");

  const params = new URLSearchParams(window.location.search);
  const agentId = params.get("agent") || "riya";

  document.getElementById("agentName").innerText = agentId.toUpperCase();

  const STORAGE_KEY = "chat_" + agentId;
  let isSending = false;

  // LOAD OLD
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  saved.forEach(m => addMessage(m.text, m.type));
  chatBox.scrollTop = chatBox.scrollHeight;

  function saveMessage(text, type) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    data.push({ text, type });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function sendMessage() {
    if (isSending) return;

    const text = msgInput.value.trim();
    if (!text) return;

    isSending = true;
    sendBtn.disabled = true;

    addMessage(text, "user");
    saveMessage(text, "user");
    msgInput.value = "";

    typing.style.display = "flex";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, message: text })
      });

      const data = await res.json();

      typing.style.display = "none";
      addMessage(data.reply || "No reply", "bot");
      saveMessage(data.reply || "No reply", "bot");

    } catch {
      typing.style.display = "none";
      addMessage("Server error", "bot");
    }

    isSending = false;
    sendBtn.disabled = false;
  }

  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

});
