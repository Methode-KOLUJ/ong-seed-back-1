const express = require("express");
const { readFile } = require("fs/promises");
const { join } = require("path");
require("dotenv").config();

const router = express.Router();

// Charger les données d'entraînement depuis un fichier JSON
async function loadTrainingData() {
  try {
    const data = await readFile(join(process.cwd(), "./Entrainement.json"), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors du chargement des données d'entraînement :", error);
    process.exit(1); 
  }
}

loadTrainingData().then((trainingData) => {
  const { SYSTEM_PROMPT, forbiddenWords, greetings } = trainingData;
  let conversationHistory = [];

  router.post("/", async (req, res) => {
    const userMessage = req.body.message?.trim().toLowerCase();

    if (!userMessage) {
      return res.status(400).json({ error: "Message manquant" });
    }

    if (forbiddenWords.some((word) => new RegExp(`\\b${word}\\b`, "i").test(userMessage))) {
      return res.json({ reply: "Désolé, je ne peux pas répondre à cette question." });
    }

    if (greetings.includes(userMessage)) {
      return res.json({ reply: "Bonjour ! Comment puis-je vous aider aujourd'hui ?" });
    }

    if (conversationHistory.length > 0) {
      const lastUserMessage = conversationHistory[conversationHistory.length - 1].content;
      if (lastUserMessage === userMessage) {
        return res.json({ reply: "Je viens déjà de répondre à cette question." });
      }
    }

    conversationHistory.push({ role: "user", content: userMessage });

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...conversationHistory],
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "Je ne sais pas quoi dire.";

      conversationHistory.push({ role: "assistant", content: botReply });

      if (conversationHistory.length > 10) {
        conversationHistory.splice(0, 2);
      }

      res.json({ reply: botReply });
    } catch (error) {
      console.error("Erreur API:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
});

module.exports = router;
