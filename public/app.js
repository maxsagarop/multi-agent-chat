const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

function addMsg(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  addMsg(text, "user");
  msgInput.value = "";
  typing.style.display = "flex";
  sendBtn.disabled = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typing.style.display = "none";

    if (data.reply) {
      addMsg(data.reply, "bot");
    } else {
      addMsg("No reply", "bot");
    }

  } catch {
    typing.style.display = "none";
    addMsg("Server error", "bot");
  }

  sendBtn.disabled = false;
}

sendBtn.onclick = sendMessage;
msgInput.onkeydown = e => e.key === "Enter" && sendMessage();    scrollBottom();
  }, 150);

  /* ================= HELPERS ================= */
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

  /* ================= SEND MESSAGE ================= */
  async function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    // 🔐 create unique request id
    const requestId = Date.now();
    activeRequestId = requestId;

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
          agentId,
          message: text
        })
      });

      const data = await res.json();

      // ⛔ ignore old reply
      if (activeRequestId !== requestId) return;

      typing.style.display = "none";

      if (data && data.reply) {
        addMessage(data.reply, "bot");
        saveMessage(data.reply, "bot");
      } else {
        addMessage("No reply from server.", "bot");
      }

    } catch (err) {
      if (activeRequestId === requestId) {
        typing.style.display = "none";
        addMessage("Server problem. Try again.", "bot");
      }
    }

    // ✅ unlock only if last request
    if (activeRequestId === requestId) {
      sendBtn.disabled = false;
      activeRequestId = null;
    }
  }

  /* ================= EVENTS ================= */
  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});    scrollBottom();
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
