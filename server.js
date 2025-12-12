import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Agents personality
const personalities = {
  riya: "Sweet, friendly Bengali girl.",
  meherin: "Calm & caring girl.",
  disha: "Funny talkative girl.",
  ayesha: "Mature supportive girl.",
  ananya: "Cute soft-spoken girl."
};

// Auto-language system prompt
const systemPrompt = `
Detect the user's language.
Always reply in the SAME language.
Be friendly, soft, and natural.
`;

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

  } catch (error) {
    console.log("Error:", error);
    res.json({ reply: "Server error." });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
