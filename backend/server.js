// Importa o Express
const express = require("express");

// Importa o CORS
const cors = require("cors");

// Importa a função de conexão
const connectDB = require("./config/db");

// Importa as rotas de usuário
const userRoutes = require("./routes/userRoutes");

// Importa as rotas de cliente
const clientRoutes = require("./routes/clientRoutes");

// Importa as rotas de produto
const productRoutes = require("./routes/productRoutes");

// Importa as rotas de dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");

// Cria a aplicação Express
const app = express();

// Conecta ao MongoDB
connectDB();

// Permite receber JSON no body
app.use(express.json());

// Habilita CORS para o frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Usa as rotas de usuários com prefixo /usuarios
app.use("/usuarios", userRoutes);

// Usa as rotas de clientes com prefixo /clientes
app.use("/clientes", clientRoutes);

// Usa as rotas de produtos com prefixo /produtos
app.use("/produtos", productRoutes);

// Usa as rotas de dashboard com prefixo /dashboard
app.use("/dashboard", dashboardRoutes);

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