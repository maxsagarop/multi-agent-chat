document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chat-box");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send-btn");
  const typing = document.getElementById("typing");
  const agentNameEl = document.getElementById("agentName");
  const agentImgEl = document.getElementById("agentImg");

  // 🔹 agent from URL
  const params = new URLSearchParams(window.location.search);
  const agentId = params.get("agent") || "riya";

  // 🔹 agent profiles
  const agents = {
    riya: {
      name: "RIYA",
      img: "https://i.ibb.co/Zz0MvrrV/1000101517.png"
    },
    meherin: {
      name: "MEHERIN",
      img: "https://i.ibb.co/Zz0MvrrV/1000101517.png"
    },
    disha: {
      name: "DISHA",
      img: "https://i.ibb.co/Zz0MvrrV/1000101517.png"
    },
    ayesha: {
      name: "AYESHA",
      img: "https://i.ibb.co/Zz0MvrrV/1000101517.png"
    },
    ananya: {
      name: "ANANYA",
      img: "https://i.ibb.co/Zz0MvrrV/1000101517.png"
    }
  };

  // 🔹 set header
  const currentAgent = agents[agentId] || agents.riya;
  agentNameEl.innerText = currentAgent.name;
  agentImgEl.src = currentAgent.img;

  function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;
    chatBox.appendChild(div);
    scrollBottom();
  }

  async function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    msgInput.value = "";

    typing.style.display = "block";
    sendBtn.disabled = true;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agentId,   // ✅ এখন dynamic
          message: text
        })
      });

      const data = await res.json();
      typing.style.display = "none";

      if (data.reply) {
        addMessage(data.reply, "bot");
      } else {
        addMessage("No reply from server", "bot");
      }

    } catch (e) {
      typing.style.display = "none";
      addMessage("Server error ❌", "bot");
    }

    sendBtn.disabled = false;
  }

  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});  };

  if (agents[agentId]) {
    agentNameEl.innerText = agents[agentId].name;
    agentImgEl.src = agents[agentId].img;
  }

  /* ================= HELPERS ================= */
  function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
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

    addMessage(text, "user");
    msgInput.value = "";
    typing.style.display = "block";
    sendBtn.disabled = true;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agentId,   // ✅ FIXED HERE
          message: text
        })
      });

      const data = await res.json();
      typing.style.display = "none";

      if (data && data.reply) {
        addMessage(data.reply, "bot");
      } else {
        addMessage("No reply from server", "bot");
      }

    } catch (e) {
      typing.style.display = "none";
      addMessage("Server error ❌", "bot");
    }

    sendBtn.disabled = false;
  }

  /* ================= EVENTS ================= */
  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});
