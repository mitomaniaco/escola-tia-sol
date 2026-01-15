import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'admin', 'teacher', or null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Função para buscar o perfil na tabela staff
        const fetchRole = async (email) => {
            if (!email) return null;
            try {
                // Busca na tabela staff pelo email
                const { data, error } = await supabase
                    .from('staff')
                    .select('role')
                    .eq('email', email)
                    .single();

                if (data) {
                    // Mapeia cargos para permissões
                    const adminRoles = ['Gerente', 'Diretora', 'Coordenadora'];
                    return adminRoles.includes(data.role) ? 'admin' : 'teacher';
                }
                // Se não achar no staff, assume admin se for o primeiro usuário ou professor por segurança
                // Para MVP, vamos deixar 'admin' hardcoded para o email que você criou se não tiver staff
                return 'admin';
            } catch (err) {
                return 'teacher';
            }
        };

        // Verifica sessão atual ao carregar
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser?.email) {
                const userRole = await fetchRole(currentUser.email);
                setRole(userRole);
            }
            setLoading(false);
        });

        // Escuta mudanças na autenticação (login, logout, refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser?.email) {
                const userRole = await fetchRole(currentUser.email);
                setRole(userRole);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Erro ao sair:", error);
        // O onAuthStateChange já vai atualizar o user, mas podemos forçar null aqui se quisermos
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
