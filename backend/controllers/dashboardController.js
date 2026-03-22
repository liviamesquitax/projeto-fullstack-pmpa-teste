// Importa os models
const User = require("../models/User");
const Client = require("../models/Client");
const Product = require("../models/Product");

// Controller do dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Conta documentos de cada coleção
    const totalUsuarios = await User.countDocuments();
    const totalClientes = await Client.countDocuments();
    const totalProdutos = await Product.countDocuments();

    // Retorna os totais
    return res.json({
      usuarios: totalUsuarios,
      clientes: totalClientes,
      produtos: totalProdutos,
    });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};