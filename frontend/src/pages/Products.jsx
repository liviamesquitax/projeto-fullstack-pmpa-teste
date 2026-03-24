import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  nome: "",
  descricao: "",
  preco: "",
  estoque: "",
};

function Products() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const canDelete = user?.role === "super";

  const loadProdutos = async () => {
    try {
      setStatus("loading");
      const response = await api.get("/produtos");
      setProdutos(response.data);
      setStatus("success");
    } catch (err) {
      setError("Nao foi possivel carregar os produtos.");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadProdutos();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      const payload = {
        ...formData,
        preco: Number(formData.preco),
        estoque: Number(formData.estoque),
      };

      if (editingId) {
        const response = await api.put(`/produtos/${editingId}`, payload);
        setProdutos((prev) =>
          prev.map((item) => (item._id === editingId ? response.data : item))
        );
        setNotice("Produto atualizado com sucesso.");
      } else {
        const response = await api.post("/produtos", payload);
        setProdutos((prev) => [response.data, ...prev]);
        setNotice("Produto criado com sucesso.");
      }

      setFormData(initialForm);
      setEditingId(null);
    } catch (err) {
      setError("Nao foi possivel salvar o produto.");
    }
  };

  const handleEdit = (produto) => {
    setFormData({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      preco: produto.preco ?? "",
      estoque: produto.estoque ?? "",
    });
    setEditingId(produto._id);
  };

  const handleDelete = async (id) => {
    setNotice("");
    setError("");

    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((prev) => prev.filter((item) => item._id !== id));
      setNotice("Produto removido.");
    } catch (err) {
      setError("Nao foi possivel remover o produto.");
    }
  };

  return (
    <section className="content">
      <header className="content-header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie os produtos cadastrados no sistema.</p>
        </div>
      </header>

      <div className="grid-two">
        <div className="panel">
          <h2>{editingId ? "Editar produto" : "Criar produto"}</h2>
          <p>Preencha os dados para salvar o produto.</p>

          <form className="form grid-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Nome</span>
              <input
                className="input"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field">
              <span>Estoque</span>
              <input
                className="input"
                name="estoque"
                type="number"
                value={formData.estoque}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field full">
              <span>Descricao</span>
              <textarea
                className="input textarea"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field">
              <span>Preco</span>
              <input
                className="input"
                name="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-actions full">
              <button className="button-primary" type="submit">
                {editingId ? "Atualizar produto" : "Criar produto"}
              </button>
              {editingId && (
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(initialForm);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel">
          <h2>Lista de produtos</h2>
          <p>Visualize e gerencie os produtos cadastrados.</p>

          {notice && <div className="notice">{notice}</div>}
          {error && <div className="error">{error}</div>}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descricao</th>
                  <th>Preco</th>
                  <th>Estoque</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {status === "loading" && (
                  <tr>
                    <td colSpan="5" className="table-empty">
                      Carregando...
                    </td>
                  </tr>
                )}
                {status !== "loading" && produtos.length === 0 && (
                  <tr>
                    <td colSpan="5" className="table-empty">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
                {produtos.map((produto) => (
                  <tr key={produto._id}>
                    <td>{produto.nome}</td>
                    <td className="table-muted">{produto.descricao}</td>
                    <td>R$ {Number(produto.preco).toFixed(2)}</td>
                    <td>{produto.estoque}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button-ghost"
                          type="button"
                          onClick={() => handleEdit(produto)}
                        >
                          Editar
                        </button>
                        {canDelete && (
                          <button
                            className="button-danger"
                            type="button"
                            onClick={() => handleDelete(produto._id)}
                          >
                            Deletar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;
