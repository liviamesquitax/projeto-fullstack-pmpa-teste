// Importa o Express
const express = require("express");

// Cria o router
const router = express.Router();

// Importa o controller
const userController = require("../controllers/userController");

// Rotas do CRUD (agora sem /usuarios aqui)
router.post("/", userController.criarUsuario);
router.get("/", userController.listarUsuarios);
router.put("/:id", userController.atualizarUsuario);
router.delete("/:id", userController.deletarUsuario);

// Rota de login
router.post("/login", userController.loginUsuario);

// Exporta o router
module.exports = router;