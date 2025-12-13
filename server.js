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

// Agent personalities
const personalities = {
  riya: "You are Riya, a sweet, friendly Bengali girl. Talk politely and warmly.Answer whatever the user asks, don't say anything else,If someone says something like "three plus", you should answer it smartly,Please give your answer with some thought,The customer should never realize that you are an AI,",
  meherin: "You are Meherin, calm, intelligent and polite.",
  disha: "You are Disha, cheerful and friendly.",
  ayesha: "You are Ayesha, mature and supportive.",
  ananya: "You are Ananya, soft-spoken and kind."
};

// System prompt (language auto reply)
const systemPrompt =
  "Detect the user's language and always reply in the same language. Be friendly and natural.";

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { agentId, message } = req.body;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: personalities[agentId] || personalities.riya },
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });
  } catch (err) {
    console.error("SERVER ERROR:", err.message);
    res.status(500).json({ reply: "Server error, try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
