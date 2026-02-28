import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token } = await login({ username, password });
            authLogin(token);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="username"
                            className="w-full px-3 py-2 border rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                        Login
                    </button>
                </form>
                <p className="mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;