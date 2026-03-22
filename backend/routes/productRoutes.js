// Importa o Express
const express = require("express");

// Cria o router
const router = express.Router();

// Importa o controller
const productController = require("../controllers/productController");

// Importa os middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Todas as rotas exigem login e role admin/super
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  productController.criarProduto
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  productController.listarProdutos
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  productController.atualizarProduto
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  productController.deletarProduto
);

// Exporta o router
module.exports = router;