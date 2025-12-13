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

  /* =====================
     TYPING CONTROL
  ===================== */
  function showTyping(show) {
    if (!typing) return;
    typing.style.display = show ? "flex" : "none";
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  /* =====================
     LOAD OLD MESSAGES
  ===================== */
  showTyping(true);

  setTimeout(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    chatBox.innerHTML = "";

    saved.forEach(m => {
      const div = document.createElement("div");
      div.className = "msg " + m.type;
      div.innerText = m.text;
      chatBox.appendChild(div);
    });

    showTyping(false);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 200);

  /* =====================
     SAVE MESSAGE
  ===================== */
  function saveMessage(text, type) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    data.push({ text, type });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /* =====================
     ADD MESSAGE
  ===================== */
  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  /* =====================
     SEND MESSAGE
  ===================== */
  async function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    saveMessage(text, "user");
    msgInput.value = "";

    showTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, message: text })
      });

      const data = await res.json();

      showTyping(false);
      addMessage(data.reply, "bot");
      saveMessage(data.reply, "bot");

    } catch (e) {
      showTyping(false);
      addMessage("Server error", "bot");
    }
  }

  /* =====================
     EVENTS
  ===================== */
  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

});
