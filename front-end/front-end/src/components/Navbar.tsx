import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="text-white text-lg">Movie Reservation</Link>
                    <div className="ml-10">
                        <Link to="/" className="text-gray-300 hover:text-white mr-4">Movies</Link>
                        <Link to="/sessions" className="text-gray-300 hover:text-white">Sessions</Link>
                    </div>
                </div>
                <div>
                    {isAuthenticated ? (
                        <>
                            <span className="text-white mr-4">Welcome, {user?.email}</span>
                            <button onClick={logout} className="text-gray-300 hover:text-white">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white mr-4">Login</Link>
                            <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;