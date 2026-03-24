import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getRoleLabel } from "../utils/auth";
import StatCard from "../components/StatCard";

function Dashboard() {
  const { user } = useAuth();
  const [dados, setDados] = useState({
    usuarios: 0,
    clientes: 0,
    produtos: 0,
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        setStatus("loading");
        const response = await api.get("/dashboard");
        setDados(response.data);
        setStatus("success");
      } catch (err) {
        setError("Nao foi possivel carregar os dados do painel.");
        setStatus("error");
      }
    };

    carregarDashboard();
  }, []);

  return (
    <section className="content">
      <header className="content-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Bem-vindo, {user?.name || user?.email || "Usuario"}. Perfil:{" "}
            <strong>{getRoleLabel(user?.role)}</strong>
          </p>
        </div>
      </header>

      {status === "error" && <div className="error">{error}</div>}

      <div className="stats-grid">
        <StatCard
          label="Total de usuarios"
          value={dados.usuarios}
          isLoading={status === "loading"}
        />
        <StatCard
          label="Total de clientes"
          value={dados.clientes}
          isLoading={status === "loading"}
        />
        <StatCard
          label="Total de produtos"
          value={dados.produtos}
          isLoading={status === "loading"}
        />
      </div>
    </section>
  );
}

export default Dashboard;