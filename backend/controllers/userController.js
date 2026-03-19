// Importa o model User
const User = require("../models/User");

// Importa bcrypt e jwt
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Criar usuário
exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    // Criptografa a senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await User.create({
      nome,
      email,
      senha: senhaHash,
      role,
    });

 // Remove a senha da resposta
    const usuarioSemSenha = {
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    };

    return res.status(201).json(usuarioSemSenha);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// Listar usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find();
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  try {
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
    const usuarioDeletado = await User.findByIdAndDelete(req.params.id);

    if (!usuarioDeletado) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.json({ mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// Login do usuário
exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ erro: "Email ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ erro: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: usuario._id, role: usuario.role },
      "segredo",
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};