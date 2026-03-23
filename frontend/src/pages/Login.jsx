import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/usuarios/login", { email, senha });
      const { token } = response.data;

      // Salva o token no localStorage
      localStorage.setItem("token", token);

      // Redireciona para o dashboard
      navigate("/dashboard");
    } catch (error) {
      alert("Login inválido");
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "60px auto", textAlign: "center" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          required
        />

        <button type="submit" style={{ width: "100%", padding: 8 }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;