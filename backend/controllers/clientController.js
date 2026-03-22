// Importa o model Client
const Client = require("../models/Client");

// Criar cliente
exports.criarCliente = async (req, res) => {
  try {
    // Cria um novo cliente com os dados do body
    const cliente = await Client.create(req.body);
    return res.status(201).json(cliente);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// Listar clientes
exports.listarClientes = async (req, res) => {
  try {
    // Busca todos os clientes
    const clientes = await Client.find();
    return res.json(clientes);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
  try {
    // Atualiza pelo ID e retorna o cliente atualizado
    const clienteAtualizado = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!clienteAtualizado) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    return res.json(clienteAtualizado);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// Deletar cliente
exports.deletarCliente = async (req, res) => {
  try {
    // Deleta pelo ID
    const clienteDeletado = await Client.findByIdAndDelete(req.params.id);

    if (!clienteDeletado) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    return res.json({ mensagem: "Cliente deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};