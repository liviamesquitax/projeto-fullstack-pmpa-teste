import { NavLink, useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getRoleLabel } from "../utils/auth";
import Button from "./Button";

const navItems = [
  { to: "/dashboard", label: "Dashboard", roles: ["admin", "super"] },
  { to: "/clientes", label: "Clientes", roles: ["admin", "super"] },
  { to: "/produtos", label: "Produtos", roles: ["admin", "super"] },
  { to: "/usuarios", label: "Usuarios", roles: ["admin", "super"] },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name || user?.email || "Usuario";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="sidebar-header">
        <div>
          <h2>Sistema TESTE</h2>
          <p>Painel administrativo</p>
        </div>
        <Button
          variant="icon"
          className="sidebar-close"
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <FiX />
        </Button>
      </div>

      <div className="sidebar-user">
        <div className="avatar">{displayName.slice(0, 2).toUpperCase()}</div>
        <div>
          <p className="user-name">{displayName}</p>
          <span className={`role-tag role-${user?.role || "user"}`}>
            {getRoleLabel(user?.role)}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>

      <button className="button-logout" onClick={handleLogout} type="button">
        Sair
      </button>
    </aside>
  );
}

export default Sidebar;
