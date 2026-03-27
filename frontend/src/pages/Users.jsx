import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Table from "../components/Table";

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
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

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
      toast.error("Falha ao carregar usuarios.");
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (usuario) => {
    setFormData({
      nome: usuario.nome || "",
      email: usuario.email || "",
      senha: "",
      role: usuario.role || "user",
    });
    setEditingId(usuario._id);
    setIsModalOpen(true);
  };

  const closeFormModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

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
      } else {
        const response = await api.post("/usuarios", formData);
        setUsuarios((prev) => [response.data, ...prev]);
      }

      toast.success("Salvo com sucesso.");
      closeFormModal();
    } catch (err) {
      setError("Nao foi possivel salvar o usuario.");
      toast.error("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (usuario) => {
    setPendingDelete(usuario);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteOpen(false);
    setPendingDelete(null);
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      await api.delete(`/usuarios/${pendingDelete._id}`);
      setUsuarios((prev) =>
        prev.filter((item) => item._id !== pendingDelete._id)
      );
      toast.success("Removido com sucesso.");
      closeDeleteModal();
    } catch (err) {
      setError("Nao foi possivel remover o usuario.");
      toast.error("Erro ao remover.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="content">
      <header className="content-header">
        <div>
          <h1>Usuarios</h1>
          <p>Gerencie os usuarios e seus perfis de acesso.</p>
        </div>
        <Button type="button" onClick={openCreateModal}>
          <FiPlus />
          Criar usuario
        </Button>
      </header>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Lista de usuarios</h2>
            <p>Visualize e gerencie os usuarios cadastrados.</p>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <Table
          columns={["Nome", "Email", "Perfil", "Ações"]}
          isLoading={status === "loading"}
          emptyMessage="Nenhum usuario encontrado."
        >
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
                  <Button
                    variant="icon"
                    type="button"
                    onClick={() => openEditModal(usuario)}
                    aria-label="Editar usuario"
                  >
                    <FiEdit2 />
                  </Button>
                  {canDelete && (
                    <Button
                      variant="icon"
                      tone="danger"
                      type="button"
                      onClick={() => openDeleteModal(usuario)}
                      aria-label="Deletar usuario"
                      disabled={
                        isDeleting && pendingDelete?._id === usuario._id
                      }
                    >
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={editingId ? "Editar usuario" : "Criar usuario"}
        description="Preencha os dados para salvar o usuario."
        onClose={closeFormModal}
        footer={
          <div className="modal-actions">
            <Button type="submit" form="usuario-form" isLoading={isSaving}>
              {isSaving ? "Carregando..." : "Salvar"}
            </Button>
            <Button variant="secondary" type="button" onClick={closeFormModal}>
              Cancelar
            </Button>
          </div>
        }
      >
        <form className="form grid-form" id="usuario-form" onSubmit={handleSubmit}>
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
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        title="Confirmar exclusao"
        description={`Tem certeza que deseja remover ${pendingDelete?.nome || "este usuario"}?`}
        onClose={closeDeleteModal}
        footer={
          <div className="modal-actions">
            <Button
              variant="danger"
              type="button"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              {isDeleting ? "Carregando..." : "Confirmar"}
            </Button>
            <Button variant="secondary" type="button" onClick={closeDeleteModal}>
              Cancelar
            </Button>
          </div>
        }
      />
    </section>
  );
}

export default Users;
