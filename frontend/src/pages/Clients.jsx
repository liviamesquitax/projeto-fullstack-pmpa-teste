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
  telefone: "",
};

function Clients() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
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

  const loadClientes = async () => {
    try {
      setStatus("loading");
      const response = await api.get("/clientes");
      setClientes(response.data);
      setStatus("success");
    } catch (err) {
      setError("Nao foi possivel carregar os clientes.");
      setStatus("error");
      toast.error("Falha ao carregar clientes.");
    }
  };

  useEffect(() => {
    loadClientes();
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

  const openEditModal = (cliente) => {
    setFormData({
      nome: cliente.nome || "",
      email: cliente.email || "",
      telefone: cliente.telefone || "",
    });
    setEditingId(cliente._id);
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
        const response = await api.put(`/clientes/${editingId}`, formData);
        setClientes((prev) =>
          prev.map((item) => (item._id === editingId ? response.data : item))
        );
      } else {
        const response = await api.post("/clientes", formData);
        setClientes((prev) => [response.data, ...prev]);
      }

      toast.success("Salvo com sucesso.");
      closeFormModal();
    } catch (err) {
      setError("Nao foi possivel salvar o cliente.");
      toast.error("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (cliente) => {
    setPendingDelete(cliente);
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
      await api.delete(`/clientes/${pendingDelete._id}`);
      setClientes((prev) =>
        prev.filter((item) => item._id !== pendingDelete._id)
      );
      toast.success("Removido com sucesso.");
      closeDeleteModal();
    } catch (err) {
      setError("Nao foi possivel remover o cliente.");
      toast.error("Erro ao remover.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="content">
      <header className="content-header">
        <div>
          <h1>Clientes</h1>
          <p>Gerencie os clientes cadastrados no sistema.</p>
        </div>
        <Button type="button" onClick={openCreateModal}>
          <FiPlus />
          Criar cliente
        </Button>
      </header>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Lista de clientes</h2>
            <p>Visualize e gerencie os clientes cadastrados.</p>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <Table
          columns={["Nome", "Email", "Telefone", "Ações"]}
          isLoading={status === "loading"}
          emptyMessage="Nenhum cliente encontrado."
        >
          {clientes.map((cliente) => (
            <tr key={cliente._id}>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>
                <div className="table-actions">
                  <Button
                    variant="icon"
                    type="button"
                    onClick={() => openEditModal(cliente)}
                    aria-label="Editar cliente"
                  >
                    <FiEdit2 />
                  </Button>
                  {canDelete && (
                    <Button
                      variant="icon"
                      tone="danger"
                      type="button"
                      onClick={() => openDeleteModal(cliente)}
                      aria-label="Deletar cliente"
                      disabled={
                        isDeleting && pendingDelete?._id === cliente._id
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
        title={editingId ? "Editar cliente" : "Criar cliente"}
        description="Preencha os dados para salvar o cliente."
        onClose={closeFormModal}
        footer={
          <div className="modal-actions">
            <Button type="submit" form="cliente-form" isLoading={isSaving}>
              {isSaving ? "Carregando..." : "Salvar"}
            </Button>
            <Button variant="secondary" type="button" onClick={closeFormModal}>
              Cancelar
            </Button>
          </div>
        }
      >
        <form className="form grid-form" id="cliente-form" onSubmit={handleSubmit}>
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
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        title="Confirmar exclusao"
        description={`Tem certeza que deseja remover ${pendingDelete?.nome || "este cliente"}?`}
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

export default Clients;
