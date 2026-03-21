import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const nav = [
    { to: '/admin/dashboard',     label: 'Dashboard',     icon: '📊' },
    { to: '/admin/movies',        label: 'Movies',         icon: '🎬' },
    { to: '/admin/sessions',      label: 'Sessions',       icon: '🎪' },
    { to: '/admin/cinema-rooms',  label: 'Cinema Rooms',   icon: '🏛️' },
];

const AdminLayout = () => {
    const { logout } = useAuth();
    const { pathname } = useLocation();

    return (
        <div className="flex min-h-screen bg-[var(--color-base)]">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 bg-[var(--color-card)] border-r border-white/7 flex flex-col sticky top-0 h-screen">
                <div className="px-6 py-5 border-b border-white/7">
                    <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-t3)] mb-1">Management</p>
                    <p className="font-[var(--font-display)] text-xl tracking-widest text-[var(--color-accent)] m-0">ADMIN</p>
                </div>

                <nav className="flex-1 p-3 flex flex-col gap-0.5">
                    {nav.map(({ to, label, icon }) => {
                        const active = pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[0.84rem] no-underline transition-all duration-150 ${
                                    active
                                        ? 'text-[var(--color-accent)] bg-[rgba(232,160,32,0.08)] border border-[rgba(232,160,32,0.25)] font-semibold'
                                        : 'text-[var(--color-t2)] border border-transparent hover:text-[var(--color-t1)] hover:bg-white/3'
                                }`}
                            >
                                <span className="text-sm">{icon}</span>
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-white/7 flex flex-col gap-0.5">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[0.8rem] text-[var(--color-t3)] no-underline hover:text-[var(--color-t2)] transition-colors"
                    >
                        ← Back to site
                    </Link>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[0.8rem] text-red-400 bg-transparent border-none cursor-pointer hover:bg-red-500/10 transition-colors text-left w-full"
                    >
                        🚪 Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto p-10 min-w-0">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
