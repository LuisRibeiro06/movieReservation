import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    console.log("Estado atual do User:", user);


    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled
                ? 'bg-[#08080e]/90 border-b border-[rgba(232,160,32,0.15)]'
                : 'bg-[#08080e]/60 border-b border-white/5'
        } backdrop-blur-xl`}>
            <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 no-underline">
                    <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center text-base">
                        🎬
                    </div>
                    <span className="font-[var(--font-display)] text-[1.4rem] tracking-widest text-[var(--color-t1)]">
                    CINEMAX
                </span>
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-8">
                    {[{ to: '/', label: 'Films' }, { to: '/sessions', label: 'Sessions' }].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`text-[0.82rem] font-medium tracking-[0.06em] uppercase no-underline pb-0.5 transition-colors duration-200 ${
                                isActive(to)
                                    ? 'text-[var(--color-accent)] border-b border-[var(--color-accent)]'
                                    : 'text-[var(--color-t2)] border-b border-transparent hover:text-[var(--color-t1)]'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Auth & Admin Group - TUDO DENTRO DESTA DIV */}
                <div className="flex items-center gap-3">
                    {(user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN') && (
                        <Link
                            to="/admin/movies"
                            className="mr-2 text-[0.7rem] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded bg-[var(--color-accent)] text-[#0a0810] hover:opacity-80 transition-opacity"
                        >
                            Admin
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            <span className="text-[0.8rem] text-[var(--color-t2)] mr-2">{user?.email}</span>
                            <button
                                onClick={logout}
                                className="text-[0.8rem] font-medium px-4 py-1.5 rounded-lg border border-white/10 text-[var(--color-t2)] hover:text-[var(--color-t1)] hover:border-[rgba(232,160,32,0.3)] hover:bg-[rgba(232,160,32,0.06)] transition-all duration-200 cursor-pointer bg-transparent"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-[0.8rem] font-medium px-4 py-1.5 rounded-lg border border-white/10 text-[var(--color-t2)] hover:text-[var(--color-t1)] hover:border-[rgba(232,160,32,0.3)] hover:bg-[rgba(232,160,32,0.06)] transition-all duration-200 no-underline"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="text-[0.8rem] font-semibold px-4 py-1.5 rounded-lg bg-[var(--color-accent)] text-[#0a0810] hover:bg-[#f0b030] hover:shadow-[0_0_20px_rgba(232,160,32,0.4)] transition-all duration-200 no-underline"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
