// Importa o Express
const express = require("express");

// Importa a função de conexão com o banco
const connectDB = require("./config/db");

// Cria a aplicação Express
const app = express();

// Conecta ao MongoDB antes de iniciar o servidor
connectDB();

// Rota de teste
app.get("/teste", (req, res) => {
  res.send("API funcionando");
});

// Porta do servidor
const PORT = 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});