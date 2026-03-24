import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  nome: "",
  email: "",
  telefone: "",
};

function Clients() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const canDelete = user?.role === "super";

  const loadClientes = async () => {
    try {
      setStatus("loading");
      const response = await api.get("/clientes");
      setClientes(response.data);
      setStatus("success");
    } catch (err) {
      setError("Nao foi possivel carregar os clientes.");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadClientes();
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
      if (editingId) {
        const response = await api.put(`/clientes/${editingId}`, formData);
        setClientes((prev) =>
          prev.map((item) => (item._id === editingId ? response.data : item))
        );
        setNotice("Cliente atualizado com sucesso.");
      } else {
        const response = await api.post("/clientes", formData);
        setClientes((prev) => [response.data, ...prev]);
        setNotice("Cliente criado com sucesso.");
      }

      setFormData(initialForm);
      setEditingId(null);
    } catch (err) {
      setError("Nao foi possivel salvar o cliente.");
    }
  };

  const handleEdit = (cliente) => {
    setFormData({
      nome: cliente.nome || "",
      email: cliente.email || "",
      telefone: cliente.telefone || "",
    });
    setEditingId(cliente._id);
  };

  const handleDelete = async (id) => {
    setNotice("");
    setError("");

    try {
      await api.delete(`/clientes/${id}`);
      setClientes((prev) => prev.filter((item) => item._id !== id));
      setNotice("Cliente removido.");
    } catch (err) {
      setError("Nao foi possivel remover o cliente.");
    }
  };

  return (
    <section className="content">
      <header className="content-header">
        <div>
          <h1>Clientes</h1>
          <p>Gerencie os clientes cadastrados no sistema.</p>
        </div>
      </header>

      <div className="grid-two">
        <div className="panel">
          <h2>{editingId ? "Editar cliente" : "Criar cliente"}</h2>
          <p>Preencha os dados para salvar o cliente.</p>

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
              <span>Email</span>
              <input
                className="input"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field full">
              <span>Telefone</span>
              <input
                className="input"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-actions full">
              <button className="button-primary" type="submit">
                {editingId ? "Atualizar cliente" : "Criar cliente"}
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
          <h2>Lista de clientes</h2>
          <p>Visualize e gerencie os clientes cadastrados.</p>

          {notice && <div className="notice">{notice}</div>}
          {error && <div className="error">{error}</div>}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {status === "loading" && (
                  <tr>
                    <td colSpan="4" className="table-empty">
                      Carregando...
                    </td>
                  </tr>
                )}
                {status !== "loading" && clientes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="table-empty">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
                {clientes.map((cliente) => (
                  <tr key={cliente._id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefone}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button-ghost"
                          type="button"
                          onClick={() => handleEdit(cliente)}
                        >
                          Editar
                        </button>
                        {canDelete && (
                          <button
                            className="button-danger"
                            type="button"
                            onClick={() => handleDelete(cliente._id)}
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

export default Clients;
