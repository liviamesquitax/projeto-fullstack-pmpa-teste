// Importa o Mongoose
const mongoose = require("mongoose");

// Cria o schema do usuário
const userSchema = new mongoose.Schema({
  // Nome do usuário (obrigatório)
  nome: {
    type: String,
    required: true,
  },

  // Email do usuário (obrigatório e único)
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // Senha do usuário (obrigatória)
  senha: {
    type: String,
    required: true,
  },

  // Nível de acesso do usuário
  role: {
    type: String,
    enum: ["super", "admin", "user"],
    default: "user",
  },
});

// Exporta o model User
module.exports = mongoose.model("User", userSchema);