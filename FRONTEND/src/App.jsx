import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import UsuariosList from "./pages/usuarios/UsuariosList";
import UsuarioForm from "./pages/usuarios/UsuarioForm";
import EmpresaForm from "./pages/empresas/EmpresaForm";
import { RequireAuth, RequireAdmin } from "./components/RoleGuard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ClientesList from "./pages/clientes/ClientesList";
import ClienteForm from "./pages/clientes/ClienteForm";
import ContratosList from "./pages/contratos/ContratosList";
import ContratoForm from "./pages/contratos/ContratoForm";
import ContratoDetalle from "./pages/contratos/ContratoDetalle";
import AuditoriaList from "./pages/auditoria/AuditoriaList";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        richColors 
        closeButton 
      />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clientes" element={<ClientesList />} />
        <Route path="/clientes/nuevo" element={<RequireAdmin><ClienteForm /></RequireAdmin>} />
        <Route path="/clientes/:id/editar" element={<RequireAdmin><ClienteForm /></RequireAdmin>} />
        <Route path="/contratos" element={<ContratosList />} />
        <Route path="/contratos/nuevo" element={<RequireAdmin><ContratoForm /></RequireAdmin>} />
        <Route path="/contratos/:id/editar" element={<RequireAdmin><ContratoForm /></RequireAdmin>} />
        <Route path="/contratos/:id" element={<ContratoDetalle />} />
        <Route path="/empresas/:id/editar" element={<RequireAdmin><EmpresaForm /></RequireAdmin>} />
        <Route path="/auditoria" element={<AuditoriaList />} />
        <Route
          path="/usuarios"
          element={
            <RequireAdmin>
              <UsuariosList />
            </RequireAdmin>
          }
        />
        <Route
          path="/usuarios/:id/editar"
          element={
            <RequireAdmin>
              <UsuarioForm />
            </RequireAdmin>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  );
}
