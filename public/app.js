document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chat-box");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send-btn");
  const typing = document.getElementById("typing");

  // 🔹 agent কে URL থেকে নেওয়া
  const params = new URLSearchParams(window.location.search);
  const agentId = params.get("agent") || "riya"; // default riya

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

    // user message
    addMessage(text, "user");
    msgInput.value = "";

    typing.style.display = "block";
    sendBtn.disabled = true;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agentId: agentId,   // 🔥 এখানে dynamic agent
          message: text
        })
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      typing.style.display = "none";

      if (data.reply) {
        addMessage(data.reply, "bot");
      } else {
        addMessage("No reply from server", "bot");
      }

    } catch (err) {
      typing.style.display = "none";
      addMessage("Server error ❌", "bot");
    }

    sendBtn.disabled = false;
  }

  // 🔹 Button click
  sendBtn.addEventListener("click", sendMessage);

  // 🔹 Enter key
  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});    typing.style.display = "block";
    sendBtn.disabled = true;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agentId: agentId,   // 🔥 এখানে আর hardcode না
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

  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agentId: agentId,   // 🔥 এখানে আর riya নাই
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

  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});          agentId: "riya",
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

  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});
