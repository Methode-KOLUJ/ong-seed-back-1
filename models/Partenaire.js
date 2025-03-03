const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, 
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nos partenaires", PartnerSchema);