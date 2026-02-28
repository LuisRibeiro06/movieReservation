import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


interface User {
    email: string;
    role: string;
}
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading : boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState< User | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken: { sub: string, role: string } = jwtDecode(token);
                setUser({email: decodedToken.sub, role: decodedToken.role});
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decodedToken: { sub: string, role: string } = jwtDecode(token);
        setUser({ email: decodedToken.sub, role: decodedToken.role});
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login,loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};