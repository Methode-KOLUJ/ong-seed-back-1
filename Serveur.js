const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const chatRoutes = require("./routes/chat");
const partnerRoutes = require("./routes/Partenaire");
require("dotenv").config();
const app = express();


const PORT = process.env.PORT || 3000;


app.use(cors({ origin: "https://ong-seed-12.vercel.app", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/chat", chatRoutes);

// Connexion à MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// Routes
app.use("/api/partenaires", partnerRoutes);


app.listen(PORT, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`);
});
