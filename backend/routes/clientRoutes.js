// Importa o Express
const express = require("express");

// Cria o router
const router = express.Router();

// Importa o controller
const clientController = require("../controllers/clientController");

// Importa os middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Todas as rotas exigem login e role admin/super
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  clientController.criarCliente
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  clientController.listarClientes
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  clientController.atualizarCliente
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  clientController.deletarCliente
);

// Exporta o router
module.exports = router;