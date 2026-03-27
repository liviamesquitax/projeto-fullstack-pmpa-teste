import { Outlet } from "react-router-dom";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`app-shell ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      <main className="app-content">
        <div className="app-topbar">
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Abrir menu"
          >
            <FiMenu />
          </button>
          <span>Painel administrativo</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
