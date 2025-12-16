document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chat-box");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send-btn");
  const typing = document.getElementById("typing");

  // 🔹 agent query parameter নাও
  const params = new URLSearchParams(window.location.search);
  const agentId = params.get("agent") || "riya";

  // 🔹 header এ agent name দেখাও
  const agentNameSpan = document.querySelector(".chat-header span");
  if (agentNameSpan) {
    agentNameSpan.innerText = agentId.toUpperCase();
  }

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agentId: agentId,   // ⭐ এখানে selected agent যাচ্ছে
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

    } catch (err) {
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
