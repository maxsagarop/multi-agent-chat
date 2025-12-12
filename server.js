const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const KEY = process.env.OPENROUTER_API_KEY; // MUST MATCH RENDER KEY

if (!KEY) {
  console.log("❌ ERROR: OPENROUTER_API_KEY not found!");
}

app.post("/api/chat", async (req, res) => {
  try {
    const { agentId, message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Reply in user's language. Friendly tone. No romance."},
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content || "Server error.";
    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Server error, try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
