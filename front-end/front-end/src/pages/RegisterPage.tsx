import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register({ username, password, email });
            navigate('/login');
        } catch {
            setError('Registration failed. Username or email may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-t1)] text-[0.9rem] placeholder:text-[var(--color-t3)] outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(232,160,32,0.12)] transition-all duration-200 font-[var(--font-body)]";
    const labelCls = "block text-[0.76rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-t2)] mb-1.5";

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)' }} />

            <div className="fade-up w-full max-w-[400px] bg-[var(--color-card)] border border-white/7 rounded-[18px] p-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-[rgba(232,160,32,0.1)] border border-[rgba(232,160,32,0.25)] rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                        🎟️
                    </div>
                    <h1 className="font-[var(--font-display)] text-[2rem] tracking-widest mb-1">CREATE ACCOUNT</h1>
                    <p className="text-[0.8rem] text-[var(--color-t3)] m-0">Join Cinemax today</p>
                </div>

                {error && (
                    <div className="bg-red-500/8 border border-red-500/20 rounded-lg px-4 py-3 mb-5 text-[0.84rem] text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="reg-username" className={labelCls}>Username</label>
                        <input id="reg-username" type="text" value={username} onChange={e => setUsername(e.target.value)}
                            placeholder="your_username" required autoComplete="username" className={inputCls} />
                    </div>
                    <div>
                        <label htmlFor="reg-email" className={labelCls}>Email</label>
                        <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com" required autoComplete="email" className={inputCls} />
                    </div>
                    <div>
                        <label htmlFor="reg-password" className={labelCls}>Password</label>
                        <input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••" required autoComplete="new-password" className={inputCls} />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 py-3.5 rounded-lg bg-[var(--color-accent)] text-[#0a0810] font-semibold text-[0.9rem] hover:bg-[#f0b030] hover:shadow-[0_0_20px_rgba(232,160,32,0.4)] transition-all duration-200 disabled:bg-[var(--color-t3)] disabled:text-[var(--color-t2)] disabled:shadow-none disabled:cursor-not-allowed cursor-pointer border-none"
                    >
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-[0.8rem] text-[var(--color-t3)]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--color-accent)] font-semibold no-underline hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
