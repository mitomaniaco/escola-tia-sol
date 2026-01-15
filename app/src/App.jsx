
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import Classes from './pages/Classes';
import ClassForm from './pages/ClassForm';
import Guardians from './pages/Guardians';
import GuardianForm from './pages/GuardianForm';
import Staff from './pages/Staff';
import StaffForm from './pages/StaffForm';
import Financial from './pages/Financial';
import FinancialChargeForm from './pages/FinancialChargeForm';
import Pedagogical from './pages/Pedagogical';
import ActivityForm from './pages/ActivityForm';
import Notices from './pages/Notices';
import NoticeForm from './pages/NoticeForm';
import Layout from './Layout';

import PortalLayout from './pages/portal/PortalLayout';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalFinancial from './pages/portal/PortalFinancial';
import PortalDiary from './pages/portal/PortalDiary';
import PortalNotices from './pages/portal/PortalNotices';

function ProtectedRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen bg-orange-50 text-orange-500 animate-pulse">Carregando...</div>;

  if (!user) return <Navigate to="/login" />;

  // Se for pai tentando acessar área admin, manda pro portal
  if (role === 'guardian' && !window.location.pathname.startsWith('/portal')) {
      return <Navigate to="/portal" replace />;
  }

  // Se for admin tentando acessar portal (opcional, mas bom pra separar)
  // if (role !== 'guardian' && window.location.pathname.startsWith('/portal')) {
  //     return <Navigate to="/" replace />;
  // }

  return children;
}

function RequireRole({ children, allowedRoles }) {
  const { role, loading } = useAuth();

  if (loading) return null;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Área dos Pais (Portal) */}
      <Route path="/portal" element={
        <ProtectedRoute>
          <PortalLayout />
        </ProtectedRoute>
      }>
        <Route index element={<PortalDashboard />} />
        <Route path="financial" element={<PortalFinancial />} />
        <Route path="diary" element={<PortalDiary />} />
        <Route path="notices" element={<PortalNotices />} />
      </Route>

      {/* Área Administrativa (Escola) */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/new" element={<StudentForm />} />

        <Route path="guardians" element={<Guardians />} />
        <Route path="guardians/new" element={<GuardianForm />} />

        <Route path="classes" element={<Classes />} />
        <Route path="classes/new" element={<ClassForm />} />

        {/* Rotas Protegidas (Admin Only) */}
        <Route path="staff" element={
          <RequireRole allowedRoles={['admin']}>
            <Staff />
          </RequireRole>
        } />
        <Route path="staff/new" element={
          <RequireRole allowedRoles={['admin']}>
            <StaffForm />
          </RequireRole>
        } />

        <Route path="financial" element={
          <RequireRole allowedRoles={['admin']}>
            <Financial />
          </RequireRole>
        } />
        <Route path="financial/new-charge" element={
          <RequireRole allowedRoles={['admin']}>
            <FinancialChargeForm />
          </RequireRole>
        } />

        <Route path="pedagogical" element={<Pedagogical />} />
        <Route path="pedagogical/new-entry" element={<ActivityForm />} />

        <Route path="notices" element={<Notices />} />
        <Route path="notices/new" element={<NoticeForm />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
