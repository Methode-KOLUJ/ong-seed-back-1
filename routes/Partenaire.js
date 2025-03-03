const express = require("express");
const router = express.Router();
const Partner = require("../models/Partenaire");

// Route : Ajouter un partenaire
router.post("/", async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const newPartner = new Partner({ name, image, description });
    await newPartner.save();
    res.status(201).json({ message: "✅ Partenaire ajouté !" });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// Route : Récupérer tous les partenaires
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

module.exports = router;