import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Users from "./pages/Users";
import AccessDenied from "./pages/AccessDenied";
import AppLayout from "./components/AppLayout";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/acesso-negado" element={<AccessDenied />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["admin", "super"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/usuarios" element={<Users />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;