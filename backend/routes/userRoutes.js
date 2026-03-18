// Importa o Express
const express = require("express");

// Cria o router
const router = express.Router();

// Importa o controller
const userController = require("../controllers/userController");

// Rotas do CRUD
router.post("/usuarios", userController.criarUsuario);
router.get("/usuarios", userController.listarUsuarios);
router.put("/usuarios/:id", userController.atualizarUsuario);
router.delete("/usuarios/:id", userController.deletarUsuario);

// Exporta o router
module.exports = router;