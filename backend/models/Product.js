// Importa o Mongoose
const mongoose = require("mongoose");

// Cria o schema do produto
const productSchema = new mongoose.Schema(
  {
    // Nome do produto
    nome: {
      type: String,
      required: true,
    },

    // Descrição do produto
    descricao: {
      type: String,
      required: true,
    },

    // Preço do produto
    preco: {
      type: Number,
      required: true,
    },

    // Quantidade em estoque
    estoque: {
      type: Number,
      required: true,
    },
  },
  {
    // Adiciona createdAt e updatedAt automaticamente
    timestamps: true,
  }
);

// Exporta o model Product
module.exports = mongoose.model("Product", productSchema);