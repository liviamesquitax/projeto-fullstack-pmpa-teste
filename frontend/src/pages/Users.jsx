import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  nome: "",
  email: "",
  senha: "",
  role: "user",
};

function Users() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const canDelete = user?.role === "super";

  const loadUsuarios = async () => {
    try {
      setStatus("loading");
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
      setStatus("success");
    } catch (err) {
      setError("Nao foi possivel carregar os usuarios.");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadUsuarios();
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
        const payload = {
          nome: formData.nome,
          email: formData.email,
          role: formData.role,
        };

        if (formData.senha) {
          payload.senha = formData.senha;
        }

        const response = await api.put(`/usuarios/${editingId}`, payload);
        setUsuarios((prev) =>
          prev.map((item) => (item._id === editingId ? response.data : item))
        );
        setNotice("Usuario atualizado com sucesso.");
      } else {
        const response = await api.post("/usuarios", formData);
        setUsuarios((prev) => [response.data, ...prev]);
        setNotice("Usuario criado com sucesso.");
      }

      setFormData(initialForm);
      setEditingId(null);
    } catch (err) {
      setError("Nao foi possivel salvar o usuario.");
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      nome: usuario.nome || "",
      email: usuario.email || "",
      senha: "",
      role: usuario.role || "user",
    });
    setEditingId(usuario._id);
  };

  const handleDelete = async (id) => {
    setNotice("");
    setError("");

    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((item) => item._id !== id));
      setNotice("Usuario removido.");
    } catch (err) {
      setError("Nao foi possivel remover o usuario.");
    }
  };

  return (
    <section className="content">
      <header className="content-header">
        <div>
          <h1>Usuarios</h1>
          <p>Gerencie os usuarios e seus perfis de acesso.</p>
        </div>
      </header>

      <div className="grid-two">
        <div className="panel">
          <h2>{editingId ? "Editar usuario" : "Criar usuario"}</h2>
          <p>Preencha os dados para salvar o usuario.</p>

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

            <label className="form-field">
              <span>Senha</span>
              <input
                className="input"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                required={!editingId}
              />
            </label>

            <label className="form-field">
              <span>Perfil</span>
              <select
                className="input"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super">Super</option>
              </select>
            </label>

            <div className="form-actions full">
              <button className="button-primary" type="submit">
                {editingId ? "Atualizar usuario" : "Criar usuario"}
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
          <h2>Lista de usuarios</h2>
          <p>Visualize e gerencie os usuarios cadastrados.</p>

          {notice && <div className="notice">{notice}</div>}
          {error && <div className="error">{error}</div>}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
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
                {status !== "loading" && usuarios.length === 0 && (
                  <tr>
                    <td colSpan="4" className="table-empty">
                      Nenhum usuario encontrado.
                    </td>
                  </tr>
                )}
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className={`role-tag role-${usuario.role}`}>
                        {usuario.role}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button-ghost"
                          type="button"
                          onClick={() => handleEdit(usuario)}
                        >
                          Editar
                        </button>
                        {canDelete && (
                          <button
                            className="button-danger"
                            type="button"
                            onClick={() => handleDelete(usuario._id)}
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

export default Users;
