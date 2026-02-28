import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
    const { logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 font-bold text-xl border-b border-gray-700">
                    Admin Panel
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/movies" className="block p-2 hover:bg-gray-700 rounded">
                        Movies
                    </Link>
                    <Link to="/admin/sessions" className="block p-2 hover:bg-gray-700 rounded">
                        Sessions
                    </Link>
                    <Link to="/admin/cinema-rooms" className="block p-2 hover:bg-gray-700 rounded">
                        Cinema Rooms
                    </Link>
                    <Link to="/admin/dashboard" className="block p-2 hover:bg-gray-700 rounded">
                        Dashboard
                    </Link>
                    <Link to="/" className="block p-2 hover:bg-gray-700 rounded text-gray-400 mt-4">
                        Back to Home
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={logout} className="text-red-400 hover:text-white w-full text-left">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;