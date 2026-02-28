// src/components/AdminRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Se não estiver autenticado, redireciona para a página de login
    if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;