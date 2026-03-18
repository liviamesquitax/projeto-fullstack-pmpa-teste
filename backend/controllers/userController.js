// Importa o model User
const User = require("../models/User");

// Criar usuário
exports.criarUsuario = async (req, res) => {
  try {
    // Cria um novo usuário com os dados do body
    const usuario = await User.create(req.body);
    return res.status(201).json(usuario);
  } catch (error) {
    // Retorna erro simples
    return res.status(400).json({ erro: error.message });
  }
};

// Listar usuários
exports.listarUsuarios = async (req, res) => {
  try {
    // Busca todos os usuários
    const usuarios = await User.find();
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  try {
    // Atualiza pelo ID e retorna o usuário atualizado
    const usuarioAtualizado = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.json(usuarioAtualizado);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// Deletar usuário
exports.deletarUsuario = async (req, res) => {
  try {
    // Deleta pelo ID
    const usuarioDeletado = await User.findByIdAndDelete(req.params.id);

    if (!usuarioDeletado) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.json({ mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};