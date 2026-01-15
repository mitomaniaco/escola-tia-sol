import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wallet, BookOpen, Notebook, Loader2, TrendingUp, AlertCircle, Cake, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeStudents: 0,
        monthlyRevenue: 0,
        pendingCharges: 0,
        overdueValue: 0
    });
    const [notices, setNotices] = useState([]);
    const [birthdays, setBirthdays] = useState([]);

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

            // 2. Financeiro (Receitas)
            // Pegamos apenas registros do tipo INCOME (Receita)
            const { data: records } = await supabase
                .from('financial_records')
                .select('amount, status, due_date, type')
                .eq('type', 'income');

            const totalRevenue = records
                ?.filter(c => c.status === 'paid')
                .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

            const pendingCount = records
                ?.filter(c => c.status === 'pending' || c.status === 'overdue')
                .length || 0;

            const overdueValue = records
                ?.filter(c => c.status === 'overdue')
                .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

            // 3. Avisos Recentes
            const { data: recentNotices } = await supabase
                .from('notices')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            // 4. Aniversariantes do Mês
            // Supabase não tem filtro fácil de "mês de data", então buscamos campos necessários e filtramos no JS por enquanto (MVP)
            const { data: students } = await supabase
                .from('students')
                .select('name, birth_date, photo_url')
                .eq('enrollment_status', 'active');

            const currentMonth = new Date().getMonth();
            const monthBirthdays = students?.filter(s => {
                if (!s.birth_date) return false;
                const birthMonth = new Date(s.birth_date).getMonth();
                return birthMonth === currentMonth;
            }) || [];

            setStats({
                activeStudents: studentCount || 0,
                monthlyRevenue: totalRevenue,
                pendingCharges: pendingCount,
                overdueValue: overdueValue
            });

            setNotices(recentNotices || []);
            setBirthdays(monthBirthdays);

        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
                    <p className="text-gray-500">Bem-vindo à Escola Tia Sol</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-600">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
            </div>

            {/* Stats Grid - Design Visual Melhorado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card Alunos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} className="text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <Users size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Alunos Ativos</h3>
                        {loading ? <Loader2 className="animate-spin text-blue-500 w-5 h-5" /> : (
                            <p className="text-3xl font-bold text-gray-800">{stats.activeStudents}</p>
                        )}
                    </div>
                </div>

                {/* Card Receita */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={64} className="text-green-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
                            <Wallet size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Receita Realizada</h3>
                        {loading ? <Loader2 className="animate-spin text-green-500 w-5 h-5" /> : (
                            <p className="text-2xl font-bold text-gray-800">
                                R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Card Inadimplência/Pendências */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle size={64} className="text-orange-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Pendências</h3>
                        {loading ? <Loader2 className="animate-spin text-orange-500 w-5 h-5" /> : (
                            <div>
                                <p className="text-3xl font-bold text-gray-800">{stats.pendingCharges}</p>
                                {stats.overdueValue > 0 && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        R$ {stats.overdueValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })} vencidos
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Card Aniversariantes */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group bg-gradient-to-br from-pink-50 to-white">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Cake size={64} className="text-pink-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
                            <Cake size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Aniversariantes (Mês)</h3>
                        {loading ? <Loader2 className="animate-spin text-pink-500 w-5 h-5" /> : (
                            <div className="flex -space-x-2 overflow-hidden mt-2 h-9 items-center">
                                {birthdays.length > 0 ? (
                                    <>
                                        {birthdays.slice(0, 4).map((student, i) => (
                                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-700" title={student.name}>
                                                {student.photo_url ? <img src={student.photo_url} className="w-full h-full rounded-full object-cover"/> : student.name.charAt(0)}
                                            </div>
                                        ))}
                                        {birthdays.length > 4 && (
                                            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                                                +{birthdays.length - 4}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Nenhum neste mês</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Acesso Rápido */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                        Acesso Rápido
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { to: "/students", label: "Alunos", icon: Users, color: "orange" },
                            { to: "/classes", label: "Turmas", icon: BookOpen, color: "blue" },
                            { to: "/financial", label: "Financeiro", icon: Wallet, color: "green" },
                            { to: "/pedagogical", label: "Diário", icon: Notebook, color: "purple" }
                        ].map((item, idx) => (
                            <Link
                                key={idx}
                                to={item.to}
                                className={`p-4 rounded-xl border border-gray-100 hover:border-${item.color}-200 hover:bg-${item.color}-50 transition-all group flex flex-col items-center gap-3 text-center`}
                            >
                                <div className={`w-12 h-12 rounded-full bg-${item.color}-50 group-hover:bg-white flex items-center justify-center text-${item.color}-600 transition-colors shadow-sm`}>
                                    <item.icon size={24} />
                                </div>
                                <span className={`text-sm font-semibold text-gray-700 group-hover:text-${item.color}-700`}>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Avisos */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Quadro de Avisos</h3>
                        <Link to="/notices" className="text-xs font-medium text-blue-600 hover:text-blue-800">Ver todos</Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-300" /></div>
                        ) : notices.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-100">
                                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Sem avisos recentes</p>
                            </div>
                        ) : (
                            notices.map(notice => (
                                <div key={notice.id} className="p-4 bg-gray-50 hover:bg-blue-50 transition-colors rounded-xl border border-gray-100 group cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            notice.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {notice.priority === 'urgent' ? 'Urgente' : 'Aviso'}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{new Date(notice.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-800 transition-colors">{notice.title}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2">{notice.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <Link to="/notices/new" className="mt-4 block w-full py-2 text-center text-sm font-medium text-gray-600 hover:text-gray-800 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        + Criar Novo Aviso
                    </Link>
                </div>
            </div>
        </div>
    );
}
