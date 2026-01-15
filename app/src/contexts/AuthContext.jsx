import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock session restoration
        const restored = localStorage.getItem('escola-user');
        if (restored) {
            try {
                setUser(JSON.parse(restored));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Mock login logic
        // In real implementation, this would call Supabase
        if (email === 'admin@escola.com' && password === 'admin') {
            const mockUser = {
                id: '1',
                email,
                name: 'Tia Sol (Admin)',
                role: 'admin'
            };
            setUser(mockUser);
            localStorage.setItem('escola-user', JSON.stringify(mockUser));
            return { data: { user: mockUser }, error: null };
        }
        return { data: null, error: { message: 'Credenciais inválidas. Tente admin@escola.com / admin' } };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('escola-user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
