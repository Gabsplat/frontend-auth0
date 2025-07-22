import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import { ProtectedRoute } from "./components/auth0/ProtectedRoute";
import PacienteDashboard from "./pages/dashboard/Paciente";
import AdministradorDashboard from "./pages/dashboard/Administrador";
import DentistaDashboard from "./pages/dashboard/Dentista";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/dashboard/paciente"
        element={
          <ProtectedRoute requiredRole="paciente">
            <PacienteDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/dentista"
        element={
          <ProtectedRoute requiredRole="dentista">
            <DentistaDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/administrador"
        element={
          <ProtectedRoute requiredRole="administrador">
            <AdministradorDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
