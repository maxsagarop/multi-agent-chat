// ---------------------------
// Render Safe server.js
// ---------------------------
const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// OpenAI init
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Agent personalities
const personalities = {
  riya: "Sweet Bengali girl. Friendly, caring.",
  meherin: "Calm, polite, intelligent girl.",
  disha: "Funny, talkative, playful girl.",
  ayesha: "Mature supportive girl.",
  ananya: "Cute soft-spoken girl."
};

// Language auto-detection
const systemPrompt = `
Detect the user's language.
Always reply in the SAME language.
Speak friendly and naturally like a girl.
`;

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { agentId, message } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
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

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("SERVER RUNNING on " + port));
