// Importa o Express
const express = require("express");

// Cria o router
const router = express.Router();

// Importa o controller
const userController = require("../controllers/userController");

// Importa os middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Rotas do CRUD
router.post("/usuarios", userController.criarUsuario);

// Login
router.post("/login", userController.loginUsuario);

// Apenas admin e super podem listar usuários
router.get(
  "/usuarios",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  userController.listarUsuarios
);

router.put("/usuarios/:id", userController.atualizarUsuario);
router.delete("/usuarios/:id", userController.deletarUsuario);

// Exporta o router
module.exports = router;