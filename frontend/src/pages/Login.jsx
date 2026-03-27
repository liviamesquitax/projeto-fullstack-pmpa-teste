import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import Button from "../components/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (["admin", "super"].includes(user.role)) {
      navigate("/dashboard");
      return;
    }

    navigate("/acesso-negado");
  }, [navigate, user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/usuarios/login", { email, senha });
      const { token } = response.data;

      login(token, email);
    } catch (err) {
      setError("Email ou senha invalidos");
      toast.error("Erro ao autenticar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <span className="badge">Acesso seguro</span>
          <h1 className="card-title">Entrar</h1>
          <p className="card-subtitle">
            Use seu email e senha para acessar o painel.
          </p>
        </div>

        <form className="form" onSubmit={handleLogin}>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input"
              required
            />
          </label>

          <label className="form-field">
            <span>Senha</span>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                className="input"
                required
              />
              <button
                type="button"
                className="input-icon-button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          {error && <div className="error">{error}</div>}

          <Button type="submit" isLoading={isLoading}>
            {isLoading ? "Carregando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;