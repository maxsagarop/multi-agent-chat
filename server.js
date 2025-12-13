const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// OpenRouter client
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

/* =====================
   SAME FRONT FOR ALL
===================== */
const systemPrompt = `
You are chatting like a real human friend.
Listen carefully to what the user says and reply ONLY to that.
Do not change the topic.
Do not give unrelated answers.
If the question is simple, give a simple clear answer.
If the user uses Bangla, reply in Bangla.
If the user uses English, reply in English.
Keep replies friendly, natural, and conversational.
`;

/* =====================
   PERSONALITY (ONLY NAME)
===================== */
const personalities = {
  riya: "Your name is Riya.",
  
  Mitu: "Your name is Mitu.",
  disha: "Your name is Disha.",
  ayesha: "Your name is Ayesha.",
  ananya: "Your name is Ananya."
};

/* =====================
   MEMORY STORE (AGENT-WISE)
===================== */
const memory = {
  riya: [],
  meherin: [],
  disha: [],
  ayesha: [],
  ananya: []
};

// Optional: memory limit (last 20 messages)
function trimMemory(agent) {
  if (memory[agent].length > 20) {
    memory[agent] = memory[agent].slice(-20);
  }
}

/* =====================
   CHAT API
===================== */
app.post("/api/chat", async (req, res) => {
  try {
    const { agentId, message } = req.body;
    const agent = personalities[agentId] ? agentId : "riya";

    // Save user message
    memory[agent].push({ role: "user", content: message });
    trimMemory(agent);

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: personalities[agent] },
        ...memory[agent]
      ]
    });

    const reply = completion.choices[0].message.content;

    // Save assistant reply
    memory[agent].push({ role: "assistant", content: reply });
    trimMemory(agent);

    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ reply: "Server error, try again." });
  }
});

/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
