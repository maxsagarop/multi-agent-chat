let activeAgent = localStorage.getItem("agent") || "riya";

const chatBox = document.getElementById("chat-box");
const typing = document.getElementById("typingIndicator");

// show message
function addMessage(text, type){
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// send to your server or temporary bot
async function fakeBotReply(userText){
  return new Promise(res=>{
    setTimeout(()=>{
      res("Okay, I got your message: " + userText);
    }, 1000);
  });
}

document.getElementById("send-btn").onclick = async () => {
  const msg = document.getElementById("msg");
  const txt = msg.value.trim();
  if(!txt) return;

  addMessage(txt,"user");
  msg.value = "";

  // typing show
  typing.style.display="flex";
  await new Promise(r=>setTimeout(r,1500));

  // fake reply (later replace with your backend)
  const reply = await fakeBotReply(txt);

  typing.style.display="none";
  addMessage(reply,"bot");
};
