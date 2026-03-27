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
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

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
      toast.error("Falha ao carregar produtos.");
    }
  };

  useEffect(() => {
    loadProdutos();
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

  const openEditModal = (produto) => {
    setFormData({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      preco: produto.preco ?? "",
      estoque: produto.estoque ?? "",
    });
    setEditingId(produto._id);
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
      } else {
        const response = await api.post("/produtos", payload);
        setProdutos((prev) => [response.data, ...prev]);
      }

      toast.success("Salvo com sucesso.");
      closeFormModal();
    } catch (err) {
      setError("Nao foi possivel salvar o produto.");
      toast.error("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (produto) => {
    setPendingDelete(produto);
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
      await api.delete(`/produtos/${pendingDelete._id}`);
      setProdutos((prev) =>
        prev.filter((item) => item._id !== pendingDelete._id)
      );
      toast.success("Removido com sucesso.");
      closeDeleteModal();
    } catch (err) {
      setError("Nao foi possivel remover o produto.");
      toast.error("Erro ao remover.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="content">
      <header className="content-header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie os produtos cadastrados no sistema.</p>
        </div>
        <Button type="button" onClick={openCreateModal}>
          <FiPlus />
          Criar produto
        </Button>
      </header>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Lista de produtos</h2>
            <p>Visualize e gerencie os produtos cadastrados.</p>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <Table
          columns={["Nome", "Descricao", "Preco", "Estoque", "Ações"]}
          isLoading={status === "loading"}
          emptyMessage="Nenhum produto encontrado."
        >
          {produtos.map((produto) => (
            <tr key={produto._id}>
              <td>{produto.nome}</td>
              <td className="table-muted">{produto.descricao}</td>
              <td>R$ {Number(produto.preco).toFixed(2)}</td>
              <td>{produto.estoque}</td>
              <td>
                <div className="table-actions">
                  <Button
                    variant="icon"
                    type="button"
                    onClick={() => openEditModal(produto)}
                    aria-label="Editar produto"
                  >
                    <FiEdit2 />
                  </Button>
                  {canDelete && (
                    <Button
                      variant="icon"
                      tone="danger"
                      type="button"
                      onClick={() => openDeleteModal(produto)}
                      aria-label="Deletar produto"
                      disabled={
                        isDeleting && pendingDelete?._id === produto._id
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
        title={editingId ? "Editar produto" : "Criar produto"}
        description="Preencha os dados para salvar o produto."
        onClose={closeFormModal}
        footer={
          <div className="modal-actions">
            <Button type="submit" form="produto-form" isLoading={isSaving}>
              {isSaving ? "Carregando..." : "Salvar"}
            </Button>
            <Button variant="secondary" type="button" onClick={closeFormModal}>
              Cancelar
            </Button>
          </div>
        }
      >
        <form className="form grid-form" id="produto-form" onSubmit={handleSubmit}>
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
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        title="Confirmar exclusao"
        description={`Tem certeza que deseja remover ${pendingDelete?.nome || "este produto"}?`}
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

export default Products;
