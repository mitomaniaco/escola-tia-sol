import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('admin@escola.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const { error } = await login(email, password);
        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="p-8">
                    <div className="flex justify-center mb-6 text-orange-500">
                        <Sun size={48} />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Escola Tia Sol</h1>
                    <p className="text-center text-gray-500 mb-8 text-sm">Plataforma de Gestão</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                                placeholder="admin@escola.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                                placeholder="••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded transition-colors shadow-lg shadow-orange-500/20 cursor-pointer text-sm"
                        >
                            Entrar
                        </button>
                    </form>
                    <div className="mt-8 text-center text-xs text-gray-400">
                        &copy; 2026 Antigravity Systems
                    </div>
                </div>
            </div>
        </div>
    );
}
