import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wallet, BookOpen, Notebook, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeStudents: 0,
        monthlyRevenue: 0,
        pendingCharges: 0
    });
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Contar Alunos Ativos
            const { count: studentCount } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true })
                .eq('enrollment_status', 'active');

            // 2. Financeiro (Buscamos tudo para calcular localmente por simplicidade)
            // Em produção real faríamos query filtrada por data
            const { data: charges } = await supabase
                .from('financial_charges')
                .select('amount, status, due_date');

            const totalRevenue = charges
                ?.filter(c => c.status === 'paid')
                .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

            const pendingCount = charges
                ?.filter(c => c.status === 'pending' || c.status === 'overdue')
                .length || 0;

            // 3. Avisos Recentes
            const { data: recentNotices } = await supabase
                .from('notices')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(2);

            setStats({
                activeStudents: studentCount || 0,
                monthlyRevenue: totalRevenue,
                pendingCharges: pendingCount
            });

            setNotices(recentNotices || []);

        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Alunos Ativos</h3>
                    {loading ? <Loader2 className="animate-spin text-orange-500" /> : (
                        <>
                            <p className="text-3xl font-bold text-gray-900">{stats.activeStudents}</p>
                            <div className="mt-4 flex items-center text-xs text-green-600 bg-green-50 w-max px-2 py-1 rounded-full">
                                Atualizado agora
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Receita Total (Recebida)</h3>
                    {loading ? <Loader2 className="animate-spin text-green-500" /> : (
                        <>
                            <p className="text-3xl font-bold text-gray-900">
                                R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <div className="mt-4 flex items-center text-xs text-gray-500">
                                Acumulado
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Cobranças Pendentes</h3>
                    {loading ? <Loader2 className="animate-spin text-red-500" /> : (
                        <>
                            <p className="text-3xl font-bold text-gray-900">{stats.pendingCharges}</p>
                            <div className="mt-4 flex items-center text-xs text-red-600 bg-red-50 w-max px-2 py-1 rounded-full">
                                {stats.pendingCharges > 0 ? 'Atenção necessária' : 'Tudo em dia'}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                        Acesso Rápido
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/students" className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-orange-100 group-hover:bg-white flex items-center justify-center text-orange-600 transition-colors">
                                <Users size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Alunos</span>
                        </Link>
                        <Link to="/classes" className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-white flex items-center justify-center text-blue-600 transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Turmas</span>
                        </Link>
                        <Link to="/financial" className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 group-hover:bg-white flex items-center justify-center text-green-600 transition-colors">
                                <Wallet size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Financeiro</span>
                        </Link>
                        <Link to="/pedagogical" className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-white flex items-center justify-center text-purple-600 transition-colors">
                                <Notebook size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Diário</span>
                        </Link>
                    </div>
                </div>

                <div className="md:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Avisos Recentes</h3>
                    <div className="space-y-4">
                        {notices.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Nenhum aviso recente.</p>
                        ) : (
                            notices.map(notice => (
                                <div key={notice.id} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-sm text-blue-800 font-medium">{notice.title}</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        {new Date(notice.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                        {/* Fallback visual enquanto não criamos notices reais */}
                        {notices.length === 0 && (
                             <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 opacity-50">
                                <p className="text-sm text-orange-800 font-medium">Exemplo de Aviso</p>
                                <p className="text-xs text-orange-600 mt-1">O mural está vazio.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
