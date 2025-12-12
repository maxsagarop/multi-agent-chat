const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Agent personalities
const personalities = {
  riya: "A friendly Bengali girl. Soft, caring, respectful. No romance.",
  meherin: "Calm, polite and supportive.",
  disha: "Playful but clean and respectful.",
  ayesha: "Mature, logical and kind.",
  ananya: "Cute, cheerful but safe."
};

// Memory store
const memory = {
  riya: [],
  meherin: [],
  disha: [],
  ayesha: [],
  ananya: []
};

// Language + Tone base prompt
const basePrompt = `
Detect the user's language.
Always reply in the SAME language.
Tone must stay safe, friendly and non-romantic.
`;

// Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { agentId, message, tone } = req.body;

    let tonePrompt = "";

    if (tone === "friendly") tonePrompt = "Be warm and friendly.";
    if (tone === "playful") tonePrompt = "Be playful but safe.";
    if (tone === "formal") tonePrompt = "Use formal respectful tone.";

    memory[agentId].push({ role: "user", content: message });

    const messages = [
      { role: "system", content: personalities[agentId] },
      { role: "system", content: basePrompt + "\n" + tonePrompt },
      ...memory[agentId]
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages
      })
    });

    const data = await response.json();
    let reply = data.choices[0].message.content;

    memory[agentId].push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.json({ reply: "Server error, try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
