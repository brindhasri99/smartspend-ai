import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import ImportCsv from "./pages/ImportCsv";
import ReceiptScanner from "./pages/ReceiptScanner";
import Insights from "./pages/Insights";

const PrivateRoute = ({ children }) => {
  const { token, booting } = useAuth();
  if (booting) {
    return <div className="app-shell flex min-h-screen items-center justify-center text-sm text-slate-400">Loading secure workspace...</div>;
  }
  return token ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="import" element={<ImportCsv />} />
        <Route path="scanner" element={<ReceiptScanner />} />
        <Route path="insights" element={<Insights />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
