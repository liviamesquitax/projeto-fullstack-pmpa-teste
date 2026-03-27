import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

function AccessDenied() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <span className="badge">Acesso restrito</span>
          <h1 className="card-title">Permissao insuficiente</h1>
          <p className="card-subtitle">
            Seu perfil ({user?.role || "user"}) nao tem acesso ao painel.
          </p>
        </div>
        <Button type="button" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </div>
  );
}

export default AccessDenied;
