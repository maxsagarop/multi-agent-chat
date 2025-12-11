// ----- Agent List -----
const agents = [
  { id: "riya", name: "রিয়া" },
  { id: "meherin", name: "মেহরিন" },
  { id: "disha", name: "দিশা" },
  { id: "ayesha", name: "আয়েশা" },
  { id: "ananya", name: "অনন্যা" }
];

let activeAgent = "riya";

// ----- Load Agents to Sidebar -----
const agentList = document.getElementById("agent-list");
agents.forEach((a) => {
  const li = document.createElement("li");
  li.textContent = a.name;
  li.dataset.id = a.id;

  if (a.id === "riya") li.classList.add("active");

  li.onclick = () => {
    document.querySelectorAll("#agent-list li").forEach((x) => x.classList.remove("active"));
    li.classList.add("active");
    activeAgent = a.id;

    loadChat();
  };

  agentList.appendChild(li);
});

// ----- Chat Box -----
const chatBox = document.getElementById("chat-box");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ----- LocalStorage Chat History -----
function saveChat(agentId, from, text) {
  const key = `chat_${agentId}`;
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  data.push({ from, text });
  localStorage.setItem(key, JSON.stringify(data));
}

function loadChat() {
  chatBox.innerHTML = "";
  const key = `chat_${activeAgent}`;
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  data.forEach((m) => addMessage(m.text, m.from));
}

loadChat();

// ----- Send Message to Server -----
async function sendToServer(text) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agentId: activeAgent,
      message: text
    })
  });

  return await res.json();
}

// ----- Send Button -----
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send-btn");

sendBtn.onclick = async () => {
  const text = msgInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  saveChat(activeAgent, "user", text);

  msgInput.value = "";

  const data = await sendToServer(text);
  const reply = data.reply || "Error";

  addMessage(reply, "bot");
  saveChat(activeAgent, "bot", reply);
};
