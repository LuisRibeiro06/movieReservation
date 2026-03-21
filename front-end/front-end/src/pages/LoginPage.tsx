import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { token } = await login({ username, password });
            authLogin(token);
            navigate('/');
        } catch {
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-8 relative">
            {/* bg glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)' }} />

            <div className="fade-up w-full max-w-[400px] bg-[var(--color-card)] border border-white/7 rounded-[18px] p-10">
                {/* Icon + title */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-[rgba(232,160,32,0.1)] border border-[rgba(232,160,32,0.25)] rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                        🎬
                    </div>
                    <h1 className="font-[var(--font-display)] text-[2rem] tracking-widest mb-1">SIGN IN</h1>
                    <p className="text-[0.8rem] text-[var(--color-t3)] m-0">Access your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/8 border border-red-500/20 rounded-lg px-4 py-3 mb-5 text-[0.84rem] text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="username" className="block text-[0.76rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-t2)] mb-1.5">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="your_username"
                            required
                            autoComplete="username"
                            className="w-full px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] text-[0.9rem] placeholder:text-[var(--color-t3)] outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(232,160,32,0.12)] transition-all duration-200 font-[var(--font-body)]"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-[0.76rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-t2)] mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            className="w-full px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] text-[0.9rem] placeholder:text-[var(--color-t3)] outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(232,160,32,0.12)] transition-all duration-200 font-[var(--font-body)]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 py-3.5 rounded-lg bg-[var(--color-accent)] text-[#0a0810] font-semibold text-[0.9rem] hover:bg-[#f0b030] hover:shadow-[0_0_20px_rgba(232,160,32,0.4)] transition-all duration-200 disabled:bg-[var(--color-t3)] disabled:text-[var(--color-t2)] disabled:shadow-none disabled:cursor-not-allowed cursor-pointer border-none"
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="text-center mt-6 text-[0.8rem] text-[var(--color-t3)]">
                    No account?{' '}
                    <Link to="/register" className="text-[var(--color-accent)] font-semibold no-underline hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
