// Importa o model Product
const Product = require("../models/Product");

// Criar produto
exports.criarProduto = async (req, res) => {
  try {
    // Cria um novo produto com os dados do body
    const produto = await Product.create(req.body);
    return res.status(201).json(produto);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// Listar produtos
exports.listarProdutos = async (req, res) => {
  try {
    // Busca todos os produtos
    const produtos = await Product.find();
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
  try {
    // Atualiza pelo ID e retorna o produto atualizado
    const produtoAtualizado = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!produtoAtualizado) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    return res.json(produtoAtualizado);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// Deletar produto
exports.deletarProduto = async (req, res) => {
  try {
    // Deleta pelo ID
    const produtoDeletado = await Product.findByIdAndDelete(req.params.id);

    if (!produtoDeletado) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    return res.json({ mensagem: "Produto deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};