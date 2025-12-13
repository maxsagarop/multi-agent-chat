document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chat-box");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send-btn");
  const typing = document.getElementById("typing");
  const agentNameEl = document.getElementById("agentName");

  if (!chatBox || !msgInput || !sendBtn || !typing) {
    console.error("Required elements missing");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const agentId = params.get("agent") || "riya";

  agentNameEl.innerText = agentId.toUpperCase();

  const STORAGE_KEY = "chat_" + agentId;
  let isSending = false; // 🔒 prevent double request

  // ================= LOAD CHAT =================
  typing.style.display = "flex";

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
    scrollBottom();
  }, 200);

  // ================= HELPERS =================
  function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
  }

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
    scrollBottom();
  }

  // ================= SEND MESSAGE =================
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
        body: JSON.stringify({
          agentId: agentId,
          message: text
        })
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      typing.style.display = "none";

      if (data && data.reply) {
        addMessage(data.reply, "bot");
        saveMessage(data.reply, "bot");
      } else {
        addMessage("No reply received.", "bot");
      }

    } catch (err) {
      typing.style.display = "none";
      addMessage("Server problem. Try again.", "bot");
    }

    isSending = false;
    sendBtn.disabled = false;
  }

  // ================= EVENTS =================
  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});
