import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [dados, setDados] = useState({
    usuarios: 0,
    clientes: 0,
    produtos: 0,
  });

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDados(response.data);
      } catch (error) {
        alert("Erro ao carregar dashboard");
      }
    };

    carregarDashboard();
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", textAlign: "center" }}>
      <h2>Dashboard</h2>

      <p>Total de usuários: {dados.usuarios}</p>
      <p>Total de clientes: {dados.clientes}</p>
      <p>Total de produtos: {dados.produtos}</p>
    </div>
  );
}

export default Dashboard;