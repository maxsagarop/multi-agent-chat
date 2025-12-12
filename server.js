const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Agent personalities
const personalities = {
  riya: "Sweet Bengali girl, friendly and caring.",
  meherin: "Calm, polite and intelligent girl.",
  disha: "Funny, talkative, playful girl.",
  ayesha: "Mature, supportive, helpful girl.",
  ananya: "Cute, soft-spoken girl."
};

const systemPrompt = `
Detect user's language.
Always reply in SAME language.
Talk naturally like a friendly girl.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { agentId, message } = req.body;

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
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.json({ reply: "AI Error: No response." });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.json({ reply: "Server error, try again." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("SERVER RUNNING on " + port));
