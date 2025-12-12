let activeAgent = localStorage.getItem("agent") || "riya";

const chatBox = document.getElementById("chat-box");
const typing = document.getElementById("typingIndicator");

// Show message bubble with animation
function addMessage(text, type){
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.textContent = text;

  chatBox.appendChild(div);

  // Auto scroll down
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Fake bot reply (later replace with your AI API)
async function fakeBotReply(msg){
  return new Promise(res=>{
    setTimeout(()=>{
      res("You said: " + msg);
    }, 900);
  });
}

document.getElementById("send-btn").onclick = async () => {
  const msg = document.getElementById("msg");
  const text = msg.value.trim();
  if(!text) return;

  addMessage(text, "user");
  msg.value = "";

  // show typing animation
  typing.style.display = "flex";
  await new Promise(r => setTimeout(r, 1200));

  const reply = await fakeBotReply(text);

  typing.style.display = "none";

  // bot final reply
  addMessage(reply, "bot");
};
