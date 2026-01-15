import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'admin', 'teacher', or null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Função para buscar o perfil na tabela staff ou guardians
        const fetchRole = async (email) => {
            if (!email) return null;
            try {
                // 1. Tenta buscar na tabela STAFF
                const { data: staffData } = await supabase
                    .from('staff')
                    .select('role')
                    .eq('email', email)
                    .maybeSingle(); // maybeSingle não joga erro se não achar

                if (staffData) {
                    const adminRoles = ['Gerente', 'Diretora', 'Coordenadora'];
                    return adminRoles.includes(staffData.role) ? 'admin' : 'teacher';
                }

                // 2. Se não for staff, tenta buscar na tabela GUARDIANS
                const { data: guardianData } = await supabase
                    .from('guardians')
                    .select('id')
                    .eq('email', email)
                    .maybeSingle();

                if (guardianData) {
                    return 'guardian';
                }

                // Se não achar, assume admin SOMENTE para o primeiro setup ou devolve null
                return 'admin'; // CUIDADO: Em prod mudar isso para null
            } catch (err) {
                console.error("Erro ao buscar role:", err);
                return null;
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
