// Importa o Express
const express = require("express");

// Cria o router
const router = express.Router();

// Importa o controller
const userController = require("../controllers/userController");

// Importa o middleware de autenticação
const authMiddleware = require("../middlewares/authMiddleware");

// Rotas públicas
router.post("/", userController.criarUsuario);      // criar usuário
router.post("/login", userController.loginUsuario); // login

// Rotas protegidas
router.get("/", authMiddleware, userController.listarUsuarios);
router.put("/:id", authMiddleware, userController.atualizarUsuario);
router.delete("/:id", authMiddleware, userController.deletarUsuario);

// Exporta o router
module.exports = router;