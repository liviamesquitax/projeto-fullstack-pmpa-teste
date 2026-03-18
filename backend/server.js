// Importa o Express
const express = require("express");

// Importa a função de conexão
const connectDB = require("./config/db");

// Importa as rotas de usuário
const userRoutes = require("./routes/userRoutes");

// Cria a aplicação Express
const app = express();

// Conecta ao MongoDB
connectDB();

// Permite receber JSON no body
app.use(express.json());

// Usa as rotas de usuários
app.use(userRoutes);

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