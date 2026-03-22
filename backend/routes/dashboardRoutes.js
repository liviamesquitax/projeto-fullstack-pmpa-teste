// Importa o Express
const express = require("express");

// Cria o router
const router = express.Router();

// Importa o controller
const dashboardController = require("../controllers/dashboardController");

// Importa os middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Rota de dashboard (admin e super)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "super"]),
  dashboardController.getDashboard
);

// Exporta o router
module.exports = router;