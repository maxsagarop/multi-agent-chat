// ---------------------------
// Render Safe server.js (Final Fixed Version)
// ---------------------------
const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// OpenRouter API Init
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

// Agent personalities
const personalities = {
  riya: "Sweet Bengali girl. Romantic, friendly & caring.",
  meherin: "Calm, polite, intelligent girl.",
  disha: "Funny, talkative, playful girl.",
  ayesha: "Mature supportive girl.",
  ananya: "Cute soft-spoken girl."
};

// Language Auto Detection
const systemPrompt = `
Detect the user's language.
Always reply in the SAME language.
Reply naturally, emotionally, like a real girl.
`;

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { agentId, message } = req.body;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",   // ✅ FIXED MODEL NAME
      messages: [
        { role: "system", content: personalities[agentId] },
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.json({ reply: "Server error, try again." });
  }
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("SERVER RUNNING on " + port));
