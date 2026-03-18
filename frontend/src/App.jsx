import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("seva_user") || "{}");
  if (!user.phone) {
    return <Navigate to={`/login/${role}`} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login/customer" element={<LoginPage role="customer" />} />
      <Route path="/login/provider" element={<LoginPage role="provider" />} />
      <Route path="/login/admin" element={<LoginPage role="admin" />} />
      
      <Route path="/customer/dashboard" element={
        <ProtectedRoute role="customer">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/provider/dashboard" element={
        <ProtectedRoute role="provider">
          <ProviderDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/login/customer" replace />} />
    </Routes>
  );
}
