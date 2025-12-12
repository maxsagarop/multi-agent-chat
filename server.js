const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Memory store for each agent
let memory = {
  riya: [],
  meherin: [],
  disha: [],
  ayesha: [],
  ananya: []
};

const personalities = {
  riya: "Sweet Bengali girl, friendly and caring.",
  meherin: "Calm and intelligent girl.",
  disha: "Funny and talkative girl.",
  ayesha: "Mature and helpful girl.",
  ananya: "Cute soft-spoken girl."
};

const systemPrompt = `
Detect user's language.
Always reply in SAME language.
Talk naturally like a real girl.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { agentId, message } = req.body;

    // ADD USER MESSAGE TO MEMORY
    memory[agentId].push({ role: "user", content: message });

    // SEND FULL CONVERSATION TO AI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: personalities[agentId] },
          { role: "system", content: systemPrompt },
          ...memory[agentId]
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.json({ reply: "AI error." });
    }

    const replyText = data.choices[0].message.content;

    // SAVE BOT REPLY TO MEMORY
    memory[agentId].push({ role: "assistant", content: replyText });

    res.json({ reply: replyText });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.json({ reply: "Server error, try again." });
  }
});

app.listen(3000, () => console.log("SERVER RUNNING"));
