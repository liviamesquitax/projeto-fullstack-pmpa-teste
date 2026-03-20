// Importa o JWT
const jwt = require("jsonwebtoken");

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  try {
    // Pega o header Authorization
    const authHeader = req.headers.authorization;

    // Verifica se o header existe
    if (!authHeader) {
      return res.status(401).json({ erro: "Token não fornecido" });
    }

    // Separa o tipo e o token (Bearer TOKEN)
    const [tipo, token] = authHeader.split(" ");

    // Verifica se o formato está correto
    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({ erro: "Token mal formatado" });
    }

    // Valida o token
    const decoded = jwt.verify(token, "segredo");

    // Coloca os dados do usuário na requisição
    req.user = decoded;

    // Libera a rota
    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido" });
  }
};

// Exporta o middleware
module.exports = authMiddleware;