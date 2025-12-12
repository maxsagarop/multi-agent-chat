let activeAgent = localStorage.getItem("agent") || "riya";
document.getElementById("agentName").textContent = activeAgent.toUpperCase();

const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typingIndicator");
const toneSelect = document.getElementById("toneSelect");
const avatarInput = document.getElementById("avatarInput");

let avatarSaved = localStorage.getItem("avatar_" + activeAgent);
if (avatarSaved) {
  document.getElementById("agentPic").src = avatarSaved;
}

avatarInput.addEventListener("change", (e) => {
  let file = e.target.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("avatar_" + activeAgent, reader.result);
    document.getElementById("agentPic").src = reader.result;
  };
  reader.readAsDataURL(file);
});

function addMessage(text, type){
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAI(message, tone) {
  try {
    let res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId: activeAgent,
        message: message,
        tone: tone
      })
    });

    let data = await res.json();
    return data.reply;

  } catch (err) {
    return "Server error, try again.";
  }
}

sendBtn.onclick = async () => {
  let text = msgInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  msgInput.value = "";

  typing.style.display = "flex";

  let reply = await askAI(text, toneSelect.value);

  typing.style.display = "none";

  addMessage(reply, "bot");
};
