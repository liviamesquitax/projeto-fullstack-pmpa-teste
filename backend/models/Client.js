// Importa o Mongoose
const mongoose = require("mongoose");

// Cria o schema do cliente
const clientSchema = new mongoose.Schema(
  {
    // Nome do cliente
    nome: {
      type: String,
      required: true,
    },

    // Email do cliente (único)
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Telefone do cliente
    telefone: {
      type: String,
      required: true,
    },
  },
  {
    // Adiciona createdAt e updatedAt automaticamente
    timestamps: true,
  }
);

// Exporta o model Client
module.exports = mongoose.model("Client", clientSchema);