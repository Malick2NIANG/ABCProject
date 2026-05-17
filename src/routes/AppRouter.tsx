import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthPage } from '../features/auth/AuthPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { StockPage } from '../features/stock/StockPage';
import { VentesPage } from '../features/ventes/VentesPage';
import { TracabilitePage } from '../features/tracabilite/TracabilitePage';
import { UsersPage } from '../features/utilisateurs/UsersPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="stock"
            element={
              <ProtectedRoute roles={['admin', 'stock']}>
                <StockPage />
              </ProtectedRoute>
            }
          />
          <Route path="ventes" element={<VentesPage />} />
          <Route
            path="tracabilite"
            element={
              <ProtectedRoute roles={['admin']}>
                <TracabilitePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="utilisateurs"
            element={
              <ProtectedRoute roles={['admin']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
