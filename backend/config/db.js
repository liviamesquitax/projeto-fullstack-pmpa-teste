// Importa o Mongoose
const mongoose = require("mongoose");

// Função para conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/projeto-fullstack-pmpa-teste");
    console.log("✅ MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error.message);
  }
};

// Exporta a função para usar em outros arquivos
module.exports = connectDB;