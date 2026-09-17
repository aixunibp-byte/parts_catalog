import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeModeProvider } from './ThemeModeContext';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import CatalogPage from './pages/CatalogPage';
import PartDetailsPage from './pages/PartDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactsPage from './pages/ContactsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPartsListPage from './pages/AdminPartsListPage';
import AdminPartEditPage from './pages/AdminPartEditPage';
import useAdminGuard from './useAdminGuard';

function RequireAdmin({ children }) {
  const { isAuthorized } = useAdminGuard();
  if (!isAuthorized) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <ThemeModeProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppHeader />
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/parts/:id" element={<PartDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin/parts" replace />} />
            <Route
              path="/admin/parts"
              element={
                <RequireAdmin>
                  <AdminPartsListPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/parts/:id"
              element={
                <RequireAdmin>
                  <AdminPartEditPage />
                </RequireAdmin>
              }
            />
          </Routes>
        </Box>
        <AppFooter />
      </Box>
    </ThemeModeProvider>
  );
}
