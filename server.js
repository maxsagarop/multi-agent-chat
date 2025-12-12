import express from "express";
import path from "path";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const personalities = {
  riya: "Friendly Bengali girl. Talk sweetly.",
  meherin: "Calm, caring girl.",
  disha: "Funny talkative girl.",
  ayesha: "Mature supportive girl.",
  ananya: "Cute soft-spoken girl."
};

const systemPrompt = `
Detect user's language automatically.
Reply in SAME LANGUAGE.
Never force Bengali.
Talk friendly like a real girl.
`;

app.post("/api/chat", async (req, res) => {
  const { agentId, message } = req.body;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: personalities[agentId] },
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]
  });

  res.json({ reply: response.choices[0].message.content });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on " + port));
